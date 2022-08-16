import {
  Button,
  IconButton,
  Modal,
  SelectButton,
  Textbox,
  Tooltip,
} from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { noImage } from 'constants/images';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchProductsAPI } from 'http/productAPI';
import { fetchTypeAPI, updateTypeAPI } from 'http/typeAPI';
import { plusIcon } from 'icons';
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
  const [typeFeatures, setTypeFeatures] = useState<IFeature[] | null>([]);
  const [typePrice, setTypePrice] = useState<number>(0);

  const controlPanelEditTypeModal = useAppSelector(
    (state) => state.modal.controlPanelEditTypeModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (controlPanelEditTypeModal.isShowing) {
      if (controlPanelEditTypeModal.mode === Modes.ADD_MODE) {
        fetchProducts();
      } else {
        fetchType();
      }
    }
  }, [controlPanelEditTypeModal.isShowing]);

  const fetchProducts = () => {
    fetchProductsAPI().then((data) => {
      setProducts(data.rows);
      fetchType();
    });
  };

  const fetchType = () => {
    fetchTypeAPI(controlPanelEditTypeModal.typeId).then((data) => {
      setType(data);
      setTypeName(data.name);
      setTypeImage(data.image);
      setTypeFeatures(data.features);
      setTypePrice(data.price);

      if (data.product) {
        setSelectedProduct(data.product);
      }
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeControlPanelEditTypeModal());

    setProducts([]);
    setType(undefined);
    setTypeName('');
    setTypeImage('');
    setTypeFeatures([]);
    setTypePrice(0);
  };

  const updateType = () => {
    if (type) {
      updateTypeAPI(
        type?.id,
        typeName,
        typeImage,
        typePrice,
        selectedProduct.id
      ).then(() => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        close();
      });
    }
  };

  return (
    <Modal
      title={
        controlPanelEditTypeModal.mode === Modes.EDIT_MODE
          ? 'Редактирование'
          : 'Новый товар'
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
                  <IconButton icon={plusIcon} />
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
        <div className={styles.main_controls}>
          {typeFeatures?.map((feature) => (
            <Button style={{ width: 'max-content' }} key={feature.id}>
              {`${feature.pluralName}: ${feature.params?.length}`}
            </Button>
          ))}

          <Tooltip label="Добавить особенности">
            <div>
              <IconButton icon={plusIcon} />
            </div>
          </Tooltip>
        </div>

        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          <Button variant={ButtonVariants.primary} onClick={updateType}>
            Изменить
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ControlPanelEditTypeModal;
