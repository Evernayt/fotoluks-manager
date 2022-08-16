import {
  Button,
  DropdownButton,
  IconButton,
  Modal,
  SelectButton,
  Textbox,
  Tooltip,
} from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { IDropdownButtonOption } from 'components/UI/DropdownButton/DropdownButton';
import { Modes } from 'constants/app';
import { noImage } from 'constants/images';
import { createClone } from 'helpers';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchFeaturesAPI } from 'http/featureAPI';
import { fetchProductsAPI } from 'http/productAPI';
import { createTypeAPI, fetchTypeAPI, updateTypeAPI } from 'http/typeAPI';
import { minusIcon, plusIcon } from 'icons';
import { IFeature } from 'models/IFeature';
import { IProduct } from 'models/IProduct';
import { IType } from 'models/IType';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditTypeModal.module.css';

const ControlPanelEditTypeModal = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>(products[0]);
  const [type, setType] = useState<IType>();
  const [typeName, setTypeName] = useState<string>('');
  const [typeImage, setTypeImage] = useState<string>('');
  const [typeFeatures, setTypeFeatures] = useState<IFeature[]>([]);
  const [typePrice, setTypePrice] = useState<number>(0);
  const [featureOptions, setFeatureOptions] = useState<IDropdownButtonOption[]>(
    []
  );

  const controlPanelEditTypeModal = useAppSelector(
    (state) => state.modal.controlPanelEditTypeModal
  );
  const controlPanelEditProductModal = useAppSelector(
    (state) => state.modal.controlPanelEditProductModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (controlPanelEditTypeModal.isShowing) {
      if (controlPanelEditTypeModal.mode === Modes.ADD_MODE) {
        fetchProducts();
        createFeatureOptions([]);
      } else {
        fetchType();
      }
    }
  }, [controlPanelEditTypeModal.isShowing]);

  useEffect(() => {
    if (
      !controlPanelEditProductModal.isShowing &&
      controlPanelEditTypeModal.isShowing
    ) {
      fetchProducts();
    }
  }, [controlPanelEditProductModal.isShowing]);

  const fetchProducts = () => {
    fetchProductsAPI().then((data) => {
      setProducts(data.rows);
      fetchType();
    });
  };

  const fetchType = () => {
    if (controlPanelEditTypeModal.mode === Modes.ADD_MODE) return;

    fetchTypeAPI(controlPanelEditTypeModal.typeId).then((data) => {
      setType(data);
      setTypeName(data.name);
      setTypeImage(data.image);
      if (data.features) {
        setTypeFeatures(data.features);
        createFeatureOptions(data.features);
      }
      setTypePrice(data.price);

      if (data.product) {
        setSelectedProduct(data.product);
      }
    });
  };

  const createFeatureOptions = (features: IFeature[]) => {
    fetchFeaturesAPI().then((data) => {
      const options: IDropdownButtonOption[] = [];
      for (let i = 0; i < data.length; i++) {
        const foundFeature = features.find(
          (feature) => feature.id === data[i].id
        );

        if (foundFeature === undefined) {
          options.push({
            id: data[i].id,
            name: data[i].name,
            onClick: () => {
              setTypeFeatures((prevState) => {
                return (prevState = [...prevState, data[i]]);
              });

              setFeatureOptions((prevState) =>
                prevState.filter((state) => state.id !== data[i].id)
              );
            },
          });
        }
      }
      setFeatureOptions(options);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeControlPanelEditTypeModal());

    setProducts([]);
    setSelectedProduct(products[0]);
    setType(undefined);
    setTypeName('');
    setTypeImage('');
    setTypeFeatures([]);
    setTypePrice(0);
  };

  const updateType = () => {
    if (type) {
      const featureIds: number[] = [];
      for (let i = 0; i < typeFeatures.length; i++) {
        featureIds.push(typeFeatures[i].id);
      }

      updateTypeAPI(type?.id, typeName, typeImage, typePrice, featureIds).then(
        () => {
          dispatch(controlPanelSlice.actions.setForceUpdate(true));
          close();
        }
      );
    }
  };

  const createType = () => {
    const featureIds: number[] = [];
    for (let i = 0; i < typeFeatures.length; i++) {
      featureIds.push(typeFeatures[i].id);
    }

    createTypeAPI(
      typeName,
      typeImage,
      typePrice,
      selectedProduct.id,
      featureIds
    ).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  const openEditProductModal = () => {
    dispatch(
      modalSlice.actions.openControlPanelEditProductModal({
        productId: 0,
        mode: Modes.ADD_MODE,
      })
    );
  };

  const removeFeature = (feature: IFeature) => {
    const features = typeFeatures.filter((state) => state.id !== feature.id);

    setTypeFeatures(features);
    createFeatureOptions(features);
  };

  return (
    <Modal
      title={
        controlPanelEditTypeModal.mode === Modes.EDIT_MODE
          ? 'Редактирование'
          : 'Новый тип'
      }
      isShowing={controlPanelEditTypeModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <div className={styles.columns}>
          <img
            className={styles.image}
            src={typeImage === '' ? noImage : typeImage}
          />
          <div>
            <div className={styles.main_controls}>
              <SelectButton
                items={products}
                defaultSelectedItem={selectedProduct}
                changeHandler={(e) => setSelectedProduct(e)}
                style={{ width: '185px' }}
                disabled={controlPanelEditTypeModal.mode === Modes.EDIT_MODE}
              />
              <Tooltip label="Добавить продукт">
                <div>
                  <IconButton icon={plusIcon} onClick={openEditProductModal} />
                </div>
              </Tooltip>
            </div>
            <Textbox
              label="Наименование"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
            />
            <Textbox
              label="Цена"
              value={typePrice}
              onChange={(e) => setTypePrice(Number(e.target.value))}
              containerStyle={{ marginTop: '12px' }}
            />
          </div>
        </div>
        <Textbox
          label="Изображение (URL)"
          value={typeImage}
          onChange={(e) => setTypeImage(e.target.value)}
          containerStyle={{ margin: '12px 0' }}
        />
        <div
          className={[styles.main_controls, styles.features_container].join(
            ' '
          )}
        >
          {typeFeatures?.map((feature) => (
            <div className={styles.feature_item}>
              <Button style={{ width: 'max-content' }} key={feature.id}>
                {feature.pluralName}
              </Button>
              <IconButton
                icon={minusIcon}
                style={{ minHeight: '32px', padding: '4px' }}
                onClick={() => removeFeature(feature)}
              ></IconButton>
            </div>
          ))}

          <DropdownButton
            options={featureOptions}
            icon={plusIcon}
            placement={Placements.rightStart}
          />
        </div>

        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          {controlPanelEditTypeModal.mode === Modes.ADD_MODE ? (
            <Button
              variant={ButtonVariants.primary}
              onClick={createType}
              disabled={selectedProduct === undefined}
            >
              Создать
            </Button>
          ) : (
            <Button variant={ButtonVariants.primary} onClick={updateType}>
              Изменить
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ControlPanelEditTypeModal;
