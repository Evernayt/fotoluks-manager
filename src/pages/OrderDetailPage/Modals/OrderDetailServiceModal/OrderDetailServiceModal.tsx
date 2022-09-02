import {
  Button,
  Modal,
  SelectButton,
  Textarea,
  Textbox,
  Tooltip,
} from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { groupBy } from 'helpers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchProductsAPI } from 'http/productAPI';
import { fetchTypesByProductIdAPI } from 'http/typeAPI';
import { IFinishedProduct } from 'models/IFinishedProduct';
import { GlobalMessageVariants } from 'models/IGlobalMessage';
import { IParam } from 'models/IParam';
import { IProduct } from 'models/IProduct';
import { ISelectedParam } from 'models/ISelectedParam';
import { IType } from 'models/IType';
import { FC, useEffect, useState } from 'react';
import { appSlice } from 'store/reducers/AppSlice';
import { orderSlice } from 'store/reducers/OrderSlice';
import { v4 as uuidv4 } from 'uuid';
import OrderDetailServiceSearch from '../../OrderDetailServiceSearch/OrderDetailServiceSearch';
import styles from './OrderDetailServiceModal.module.css';

interface OrderDetailServiceModalProps {
  isShowing: boolean;
  hide: () => void;
  mode: Modes;
  finishedProduct: IFinishedProduct | null;
}

const OrderDetailServiceModal: FC<OrderDetailServiceModalProps> = ({
  isShowing,
  hide,
  mode,
  finishedProduct,
}) => {
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
  const [selectedParams, setSelectedParams] = useState<ISelectedParam[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [comment, setComment] = useState<string>('');

  const finishedProductsForCreate = useAppSelector(
    (state) => state.order.finishedProductsForCreate
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (mode === Modes.EDIT_MODE && finishedProduct) {
      setPrice(finishedProduct.price);
      setQuantity(finishedProduct.quantity);
      setComment(finishedProduct.comment);

      fetchProductsAPI().then((productData) => {
        setProducts(productData.rows);
        setSelectedProduct(finishedProduct.product);

        fetchTypesByProductIdAPI(finishedProduct.product.id).then(
          (typeData) => {
            setTypes(typeData);

            const selectedFinishedProductType = typeData.find(
              (type) => type.id === finishedProduct.type.id
            );
            if (!selectedFinishedProductType) return;
            setSelectedType(selectedFinishedProductType);

            if (selectedFinishedProductType.params) {
              setFeatures(
                groupBy(selectedFinishedProductType.params, 'featureId')
              );

              for (let i = 0; i < finishedProduct.selectedParams.length; i++) {
                setSelectedParams((prevState) => [
                  ...prevState,
                  {
                    id: finishedProduct.selectedParams[i].id,
                    param: finishedProduct.selectedParams[i].param,
                  },
                ]);
              }
            }
          }
        );
      });
    } else if (mode === Modes.ADD_MODE) {
      fetchProducts();
    }
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
    setPrice(0);

    setSelectedType(initialType);
    setFeatures([]);
    setSelectedParams([]);
    fetchTypes(product.id);
  };

  const selectType = (type: IType) => {
    setSelectedType(type);
    setPrice(type.price);

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
    setPrice(0);

    setSelectedType(initialType);
    fetchTypesByProductIdAPI(product.id).then((data) => {
      setTypes(data);
      selectType(type);
    });
  };

  const isValidationSuccess = () => {
    if (selectedProduct.id === 0) {
      dispatch(
        appSlice.actions.showGlobalMessage({
          message: 'Выберите продукт',
          variant: GlobalMessageVariants.warning,
          isShowing: true,
        })
      );
      return false;
    } else if (types.length !== 0 && selectedType.id === 0) {
      dispatch(
        appSlice.actions.showGlobalMessage({
          message: 'Выберите тип',
          variant: GlobalMessageVariants.warning,
          isShowing: true,
        })
      );
      return false;
    } else {
      return true;
    }
  };

  const createOrUpdateFinishedProduct = () => {
    if (!isValidationSuccess()) return;

    const createFinishedProduct = (
      finishedProductId: number | string
    ): IFinishedProduct => {
      return {
        id: finishedProductId,
        price,
        quantity,
        comment,
        folder: '',
        product: selectedProduct,
        type: selectedType,
        selectedParams,
      };
    };

    const updateFinishedProduct = (
      finishedProduct: IFinishedProduct
    ): IFinishedProduct => {
      return {
        id: finishedProduct.id,
        price,
        quantity,
        comment,
        folder: finishedProduct.folder,
        product: selectedProduct,
        type: selectedType,
        selectedParams,
      };
    };

    if (mode === Modes.ADD_MODE) {
      const createdFinishedProduct = createFinishedProduct(uuidv4());
      dispatch(orderSlice.actions.addFinishedProduct(createdFinishedProduct));
      dispatch(
        orderSlice.actions.addFinishedProductsForCreate(createdFinishedProduct)
      );
    } else {
      if (finishedProduct) {
        const updatedFinishedProduct = updateFinishedProduct(finishedProduct);
        dispatch(
          orderSlice.actions.updateFinishedProduct(updatedFinishedProduct)
        );

        const isNotFoundForCreate =
          finishedProductsForCreate.find((x) => x.id === finishedProduct.id) ===
          undefined;

        if (isNotFoundForCreate) {
          dispatch(
            orderSlice.actions.addFinishedProductsForUpdate(
              updatedFinishedProduct
            )
          );
        } else {
          dispatch(
            orderSlice.actions.addFinishedProductsForCreate(
              updatedFinishedProduct
            )
          );
        }
      }
    }
    hide();
  };

  return (
    <Modal
      title={
        mode === Modes.ADD_MODE ? 'Добавление услуги' : 'Редактирование услуги'
      }
      isShowing={isShowing}
      hide={hide}
    >
      <div className={styles.container}>
        {mode === Modes.ADD_MODE && (
          <OrderDetailServiceSearch
            searchSelect={searchSelect}
            style={{ marginBottom: '16px' }}
          />
        )}
        <div className={styles.main_controls}>
          <SelectButton
            items={products}
            defaultSelectedItem={selectedProduct}
            disabled={mode === Modes.EDIT_MODE}
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
        <div className={styles.main_controls}>
          <Textbox
            label="Количество"
            style={{ width: '100%' }}
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <Textbox
            label="Цена"
            style={{ width: '100%' }}
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <Textarea
          label="Комментарий"
          style={{ resize: 'vertical', marginBottom: '12px' }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          variant={ButtonVariants.primary}
          onClick={createOrUpdateFinishedProduct}
        >
          {mode === Modes.ADD_MODE ? 'Добавить' : 'Изменить'}
        </Button>
      </div>
    </Modal>
  );
};

export default OrderDetailServiceModal;
