import FeatureAPI from 'api/FeatureAPI/FeatureAPI';
import FileAPI from 'api/FileAPI/FileAPI';
import ProductAPI from 'api/ProductAPI/ProductAPI';
import { CreateTypeDto } from 'api/TypeAPI/dto/create-type.dto';
import { UpdateTypeDto } from 'api/TypeAPI/dto/update-type.dto';
import TypeAPI from 'api/TypeAPI/TypeAPI';
import {
  Button,
  DropdownButton,
  EditableImage,
  IconButton,
  Modal,
  SelectButton,
  Textbox,
  Tooltip,
} from 'components';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import { ButtonVariants } from 'components/UI/Button/Button';
import { IDropdownButtonOption } from 'components/UI/DropdownButton/DropdownButton';
import { Modes } from 'constants/app';
import { noImage } from 'constants/images';
import { INITIAL_PRODUCT } from 'constants/states/product-states';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconMinus, IconPlus } from 'icons';
import { IFeature } from 'models/api/IFeature';
import { IProduct } from 'models/api/IProduct';
import { IType } from 'models/api/IType';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditTypeModal.module.scss';

const ControlPanelEditTypeModal = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<IProduct>(INITIAL_PRODUCT);
  const [type, setType] = useState<IType>();
  const [name, setName] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [typeFeatures, setTypeFeatures] = useState<IFeature[]>([]);
  const [featureOptions, setFeatureOptions] = useState<IDropdownButtonOption[]>(
    []
  );

  const editTypeModal = useAppSelector(
    (state) => state.modal.controlPanelEditTypeModal
  );
  const editProductModal = useAppSelector(
    (state) => state.modal.controlPanelEditProductModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editTypeModal.isShowing) {
      if (editTypeModal.mode === Modes.ADD_MODE) {
        fetchProducts();
        createFeatureOptions([]);
      } else {
        fetchType();
      }
    }
  }, [editTypeModal.isShowing]);

  useEffect(() => {
    if (!editProductModal.isShowing && editTypeModal.isShowing) {
      fetchProducts();
    }
  }, [editProductModal.isShowing]);

  const fetchProducts = () => {
    ProductAPI.getAll().then((data) => {
      setProducts(data.rows);
      fetchType();
    });
  };

  const fetchType = () => {
    if (editTypeModal.mode === Modes.ADD_MODE) return;

    TypeAPI.getOne(editTypeModal.typeId).then((data) => {
      setType(data);
      setName(data.name);
      setImage(data.image);
      if (data.features) {
        setTypeFeatures(data.features);
        createFeatureOptions(data.features);
      }
      setPrice(data.price);

      if (data.product) {
        setSelectedProduct(data.product);
      }
    });
  };

  const createFeatureOptions = (features: IFeature[]) => {
    FeatureAPI.getAll().then((data) => {
      const options: IDropdownButtonOption[] = [];
      data.rows.forEach((dataFeature) => {
        const foundFeature = features.find(
          (feature) => feature.id === dataFeature.id
        );

        if (!foundFeature) {
          options.push({
            id: dataFeature.id,
            name: dataFeature.name,
            onClick: () => {
              setTypeFeatures((prevState) => {
                return (prevState = [...prevState, dataFeature]);
              });

              setFeatureOptions((prevState) =>
                prevState.filter((state) => state.id !== dataFeature.id)
              );
            },
          });
        }
      });
      setFeatureOptions(options);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('controlPanelEditTypeModal'));

    setProducts([]);
    setSelectedProduct(INITIAL_PRODUCT);
    setType(undefined);
    setName('');
    setImage('');
    setPrice(0);
    setTypeFeatures([]);
  };

  const updateType = () => {
    if (type) {
      const updatedType: UpdateTypeDto = { id: type.id, name, price };

      const featureIds: number[] = [];
      typeFeatures.forEach((typeFeature) => {
        featureIds.push(typeFeature.id);
      });

      TypeAPI.update({ ...updatedType, featureIds }).then(() => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        close();
      });
    }
  };

  const createType = () => {
    const featureIds: number[] = [];
    typeFeatures.forEach((typeFeature) => {
      featureIds.push(typeFeature.id);
    });

    const createdType: CreateTypeDto = {
      name,
      price,
      productId: selectedProduct.id,
      featureIds,
    };

    TypeAPI.create(createdType).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  const openEditProductModal = () => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditProductModal',
        props: { productId: 0, mode: Modes.ADD_MODE },
      })
    );
  };

  const removeFeature = (feature: IFeature) => {
    const features = typeFeatures.filter((state) => state.id !== feature.id);

    setTypeFeatures(features);
    createFeatureOptions(features);
  };

  const openEditParamsModal = (feature: IFeature) => {
    if (type) {
      dispatch(
        modalSlice.actions.openModal({
          modal: 'controlPanelEditTypeParamsModal',
          props: { typeId: type.id, feature },
        })
      );
    }
  };

  const editImage = (image: File) => {
    FileAPI.uploadFile(image, { isManagerFile: true }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          if (type) {
            const updatedType: UpdateTypeDto = {
              id: type.id,
              image: data.link,
            };
            TypeAPI.update(updatedType).then(() => {
              setImage(data.link);
            });
          }
        });
      } else {
        res.json().then((data) => {
          showGlobalMessage(data.message);
        });
      }
    });
  };

  return (
    <Modal
      title={
        editTypeModal.mode === Modes.EDIT_MODE ? 'Редактирование' : 'Новый тип'
      }
      isShowing={editTypeModal.isShowing}
      hide={close}
    >
      <div
        style={{
          maxWidth: editTypeModal.mode === Modes.EDIT_MODE ? '417px' : '245px',
        }}
      >
        <div className={styles.columns}>
          {editTypeModal.mode === Modes.EDIT_MODE && (
            <EditableImage
              className={styles.image}
              image={image ? image : noImage}
              size={148}
              onImageSelect={editImage}
            />
          )}
          <div className={styles.controls_container}>
            <div className={styles.main_controls}>
              <Tooltip label="Продукт">
                <SelectButton
                  items={products}
                  defaultSelectedItem={selectedProduct}
                  onChange={setSelectedProduct}
                  style={{ width: '185px' }}
                  disabled={editTypeModal.mode === Modes.EDIT_MODE}
                />
              </Tooltip>
              <Tooltip label="Добавить продукт">
                <div>
                  <IconButton
                    icon={<IconPlus className="secondary-icon" />}
                    onClick={openEditProductModal}
                  />
                </div>
              </Tooltip>
            </div>
            <Textbox
              label="Наименование"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Textbox
              label="Цена"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
        </div>
        <div
          className={[styles.main_controls, styles.features_container].join(
            ' '
          )}
        >
          {typeFeatures?.map((feature) => (
            <div className={styles.feature_item} key={feature.id}>
              <Button
                disabled={!type}
                onClick={() => openEditParamsModal(feature)}
              >
                {feature.pluralName}
              </Button>

              <IconButton
                icon={<IconMinus className="secondary-icon" />}
                style={{ minHeight: '32px', padding: '4px' }}
                onClick={() => removeFeature(feature)}
              />
            </div>
          ))}

          <DropdownButton
            options={featureOptions}
            icon={<IconPlus className="secondary-icon" />}
            placement={Placements.rightStart}
          />
        </div>

        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          {editTypeModal.mode === Modes.ADD_MODE ? (
            <Button
              variant={ButtonVariants.primary}
              onClick={createType}
              disabled={selectedProduct.id === INITIAL_PRODUCT.id}
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
