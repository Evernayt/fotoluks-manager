import FavoriteAPI from 'api/FavoriteAPI/FavoriteAPI';
import ProductAPI from 'api/ProductAPI/ProductAPI';
import TypeAPI from 'api/TypeAPI/TypeAPI';
import { Button, Modal, SelectButton } from 'components';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import { ButtonVariants } from 'components/UI/Button/Button';
import { INITIAL_PRODUCT } from 'constants/states/product-states';
import { INITIAL_TYPE } from 'constants/states/type-states';
import { groupBy } from 'helpers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IFavoriteParam } from 'models/api/IFavoriteParam';
import { IParam } from 'models/api/IParam';
import { IProduct } from 'models/api/IProduct';
import { IType } from 'models/api/IType';
import { GlobalMessageVariants } from 'models/IGlobalMessage';
import { useEffect, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import { orderSlice } from 'store/reducers/OrderSlice';
import { v4 as uuidv4 } from 'uuid';
import OrderDetailServiceSearch from '../../OrderDetailServiceSearch/OrderDetailServiceSearch';
import styles from './OrderDetailAddFavoriteModal.module.scss';

const OrderDetailAddFavoriteModal = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [types, setTypes] = useState<IType[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<IProduct>(INITIAL_PRODUCT);
  const [selectedType, setSelectedType] = useState<IType>(INITIAL_TYPE);
  const [features, setFeatures] = useState<IParam[][]>([]);
  const [selectedParams, setSelectedParams] = useState<IFavoriteParam[]>([]);

  const orderDetailAddFavoriteModal = useAppSelector(
    (state) => state.modal.orderDetailAddFavoriteModal
  );
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    ProductAPI.getAll().then((data) => {
      setProducts(data.rows);
    });
  };

  const fetchTypes = (productId: number) => {
    TypeAPI.getAll({ productId }).then((data) => {
      setTypes(data.rows);
    });
  };

  const selectProduct = (product: IProduct) => {
    setSelectedProduct(product);

    setSelectedType(INITIAL_TYPE);
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

    setSelectedType(INITIAL_TYPE);
    TypeAPI.getAll({ productId: product.id }).then((data) => {
      setTypes(data.rows);
      selectType(type);
    });
  };

  const isValidationSuccess = () => {
    if (selectedProduct.id === 0) {
      showGlobalMessage('Выберите продукт', GlobalMessageVariants.warning);
      return false;
    } else if (types.length !== 0 && selectedType.id === 0) {
      showGlobalMessage('Выберите тип', GlobalMessageVariants.warning);
      return false;
    } else {
      return true;
    }
  };

  const createFavorite = () => {
    if (!employee) return;
    if (!isValidationSuccess()) return;
    FavoriteAPI.create({
      typeId: selectedType.id,
      employeeId: employee.id,
      selectedParams,
    }).then((data) => {
      dispatch(orderSlice.actions.addFavorite(data));
      close();
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('orderDetailAddFavoriteModal'));
  };

  return (
    <Modal
      title="Добавление в избранное"
      isShowing={orderDetailAddFavoriteModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <OrderDetailServiceSearch
          style={{ marginBottom: '16px' }}
          onClick={searchSelect}
        />
        <div className={styles.main_controls}>
          <SelectButton
            items={products}
            defaultSelectedItem={selectedProduct}
            onChange={(e) => selectProduct(e)}
            style={{ width: '228px' }}
          />
          {types.length !== 0 && (
            <SelectButton
              items={types}
              defaultSelectedItem={selectedType}
              onChange={(e) => selectType(e)}
              style={{ width: '228px' }}
            />
          )}
        </div>
        <div className={styles.features_container}>
          {features.map((feature, index) => (
            <SelectButton
              title={feature[0].feature?.name || ''}
              items={feature}
              defaultSelectedItem={selectedParams[index]?.param!}
              onChange={(e) => selectParam(e)}
              style={{ width: '228px' }}
              tooltipProps={{ delay: 600 }}
              key={index}
            />
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
