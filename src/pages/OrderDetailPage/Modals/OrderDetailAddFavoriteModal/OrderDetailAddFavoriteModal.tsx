import { Button, Modal, SelectButton, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { groupBy } from 'helpers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { createFavoriteAPI } from 'http/favoriteAPI';
import { fetchProductsAPI } from 'http/productAPI';
import { fetchTypesByProductIdAPI } from 'http/typeAPI';
import { IFavoriteParam } from 'models/IFavoriteParam';
import { IParam } from 'models/IParam';
import { IProduct } from 'models/IProduct';
import { IType } from 'models/IType';
import { useEffect, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import { orderSlice } from 'store/reducers/OrderSlice';
import { v4 as uuidv4 } from 'uuid';
import OrderDetailServiceSearch from '../../OrderDetailServiceSearch/OrderDetailServiceSearch';
import styles from './OrderDetailAddFavoriteModal.module.css';

const OrderDetailAddFavoriteModal = () => {
  const initialProduct: IProduct = {
    id: 0,
    name: 'Выберите продукт',
    pluralName: '',
    description: '',
    image: '',
  };

  const initialType: IType = {
    id: 0,
    name: 'Выберите тип',
    price: 0,
    image: '',
    features: [],
  };

  const [products, setProducts] = useState<IProduct[]>([]);
  const [types, setTypes] = useState<IType[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<IProduct>(initialProduct);
  const [selectedType, setSelectedType] = useState<IType>(initialType);
  const [features, setFeatures] = useState<IParam[][]>([]);
  const [selectedParams, setSelectedParams] = useState<IFavoriteParam[]>([]);

  const orderDetailAddFavoriteModal = useAppSelector(
    (state) => state.modal.orderDetailAddFavoriteModal
  );
  const user = useAppSelector((state) => state.user.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetchProductsAPI().then((data) => {
      setProducts(data.rows);
    });
  };

  const fetchTypes = (productId: number) => {
    fetchTypesByProductIdAPI(productId).then((data) => {
      setTypes(data);
    });
  };

  const selectProduct = (product: IProduct) => {
    setSelectedProduct(product);

    setSelectedType(initialType);
    setFeatures([]);
    setSelectedParams([]);
    fetchTypes(product.id);
  };

  const selectType = (type: IType) => {
    setSelectedType(type);

    if (type.params) {
      const gropedParams: IParam[][] = groupBy(type.params, 'featureId');
      setFeatures(gropedParams);
      setSelectedParams([]);
      for (let i = 0; i < gropedParams.length; i++) {
        setSelectedParams((prevState) => [
          ...prevState,
          {
            id: uuidv4(),
            param: gropedParams[i][0],
          },
        ]);
      }
    }
  };

  const selectParam = (param: IParam) => {
    setSelectedParams((prevState) =>
      prevState.map((state) =>
        state.param?.featureId === param.featureId ? { ...state, param } : state
      )
    );
  };

  const searchSelect = (product: IProduct, type: IType) => {
    setSelectedProduct(product);

    setSelectedType(initialType);
    fetchTypesByProductIdAPI(product.id).then((data) => {
      setTypes(data);
      selectType(type);
    });
  };

  const createFavorite = () => {
    if (!user) return;
    createFavoriteAPI(selectedType.id, selectedParams, user.id).then((data) => {
      dispatch(orderSlice.actions.addFavorite(data));
      close();
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeOrderDetailAddFavoriteModal());
  };

  return (
    <Modal
      title="Добавление в избранное"
      isShowing={orderDetailAddFavoriteModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <OrderDetailServiceSearch
          searchSelect={searchSelect}
          style={{ marginBottom: '16px' }}
        />
        <div className={styles.main_controls}>
          <SelectButton
            items={products}
            defaultSelectedItem={selectedProduct}
            changeHandler={(e) => selectProduct(e)}
            style={{ width: '228px' }}
          />
          {types.length !== 0 && (
            <SelectButton
              items={types}
              defaultSelectedItem={selectedType}
              changeHandler={(e) => selectType(e)}
              style={{ width: '228px' }}
            />
          )}
        </div>
        <div className={styles.features_container}>
          {features.map((feature, index) => (
            <Tooltip
              label={feature[0].feature?.name ? feature[0].feature?.name : ''}
              delay={600}
              key={index}
            >
              <div>
                <SelectButton
                  items={feature}
                  defaultSelectedItem={selectedParams[index]?.param!}
                  changeHandler={(e) => selectParam(e)}
                  style={{ width: '228px' }}
                />
              </div>
            </Tooltip>
          ))}
        </div>
        <Button variant={ButtonVariants.primary} onClick={createFavorite}>
          Добавить
        </Button>
      </div>
    </Modal>
  );
};

export default OrderDetailAddFavoriteModal;
