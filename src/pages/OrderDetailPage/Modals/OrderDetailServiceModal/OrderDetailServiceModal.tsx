import ProductAPI from 'api/ProductAPI/ProductAPI';
import TypeAPI from 'api/TypeAPI/TypeAPI';
import {
  Button,
  Loader,
  Modal,
  SelectButton,
  Textarea,
  Textbox,
  Tooltip,
} from 'components';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { INITIAL_PRODUCT } from 'constants/states/product-states';
import { INITIAL_TYPE } from 'constants/states/type-states';
import { groupBy } from 'helpers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IFinishedProduct } from 'models/api/IFinishedProduct';
import { IParam } from 'models/api/IParam';
import { IProduct } from 'models/api/IProduct';
import { ISelectedParam } from 'models/api/ISelectedParam';
import { IType } from 'models/api/IType';
import { GlobalMessageVariants } from 'models/IGlobalMessage';
import { FC, useEffect, useState } from 'react';
import { orderSlice } from 'store/reducers/OrderSlice';
import { v4 as uuidv4 } from 'uuid';
import OrderDetailServiceSearch from '../../OrderDetailServiceSearch/OrderDetailServiceSearch';
import styles from './OrderDetailServiceModal.module.scss';

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
  const [products, setProducts] = useState<IProduct[]>([]);
  const [types, setTypes] = useState<IType[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<IProduct>(INITIAL_PRODUCT);
  const [selectedType, setSelectedType] = useState<IType>(INITIAL_TYPE);
  const [features, setFeatures] = useState<IParam[][]>([]);
  const [selectedParams, setSelectedParams] = useState<ISelectedParam[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [comment, setComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(mode === Modes.EDIT_MODE);

  const finishedProductsForCreate = useAppSelector(
    (state) => state.order.finishedProductsForCreate
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (mode === Modes.EDIT_MODE && finishedProduct) {
      setPrice(finishedProduct.price);
      setQuantity(finishedProduct.quantity);
      setComment(finishedProduct.comment);

      ProductAPI.getAll().then((productData) => {
        setProducts(productData.rows);
        if (!finishedProduct.product) return;
        setSelectedProduct(finishedProduct.product);

        const productId = finishedProduct.product.id;
        TypeAPI.getAll({ productId })
          .then((typeData) => {
            setTypes(typeData.rows);

            const selectedFinishedProductType = typeData.rows.find(
              (type) => type.id === finishedProduct.type?.id
            );
            if (!selectedFinishedProductType) return;
            setSelectedType(selectedFinishedProductType);

            if (selectedFinishedProductType.params) {
              setFeatures(
                groupBy(selectedFinishedProductType.params, 'featureId')
              );

              if (!finishedProduct.selectedParams) return;
              for (let i = 0; i < finishedProduct.selectedParams.length; i++) {
                const selectedParam = finishedProduct.selectedParams[i];
                setSelectedParams((prevState) => [
                  ...prevState,
                  {
                    id: selectedParam.id,
                    param: selectedParam.param,
                  },
                ]);
              }
            }
          })
          .finally(() => setIsLoading(false));
      });
    } else if (mode === Modes.ADD_MODE) {
      fetchProducts();
    }
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
    if (product === INITIAL_PRODUCT) return;

    setSelectedProduct(product);
    setPrice(0);

    setSelectedType(INITIAL_TYPE);
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

  const createOrUpdateFinishedProduct = () => {
    if (!isValidationSuccess()) return;

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
        {isLoading && (
          <div className={styles.loader}>
            <Loader />
          </div>
        )}
        {mode === Modes.ADD_MODE && (
          <OrderDetailServiceSearch
            style={{ marginBottom: '16px' }}
            onClick={searchSelect}
          />
        )}
        <div className={styles.main_controls}>
          <SelectButton
            items={products}
            defaultSelectedItem={selectedProduct}
            disabled={mode === Modes.EDIT_MODE}
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
            <Tooltip
              label={feature[0].feature?.name || ''}
              delay={600}
              key={index}
            >
              <div>
                <SelectButton
                  items={feature}
                  defaultSelectedItem={selectedParams[index]?.param!}
                  onChange={(e) => selectParam(e)}
                  style={{ width: '228px' }}
                />
              </div>
            </Tooltip>
          ))}
        </div>
        <div className={styles.main_controls}>
          <Textbox
            label="Количество"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <Textbox
            label="Цена"
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
