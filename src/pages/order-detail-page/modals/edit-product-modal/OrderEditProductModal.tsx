import {
  Badge,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { modalActions } from 'store/reducers/ModalSlice';
import {
  ICON_SIZE,
  ICON_STROKE,
  MODES,
  REQUIRED_INVALID_MSG,
} from 'constants/app';
import OrderProductSearch from 'pages/order-detail-page/components/product-search/OrderProductSearch';
import { IProduct } from 'models/api/IProduct';
import * as Yup from 'yup';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import { orderActions } from 'store/reducers/OrderSlice';
import { IOrderProduct } from 'models/api/IOrderProduct';
import { v4 as uuidv4 } from 'uuid';
import { calcSumWithDiscount } from 'pages/order-detail-page/OrderDetailPage.service';
import FavoriteAPI from 'api/FavoriteAPI/FavoriteAPI';
import { AutoResizableTextarea } from 'components';
import OrderFavoritesTable from './favorites/OrderFavoritesTable';
import { getErrorToast } from 'helpers/toast';
import AttachFiles from './attach-files/AttachFiles';
import styles from './OrderEditProductModal.module.scss';

const formSchema = Yup.object({
  quantity: Yup.string().required(REQUIRED_INVALID_MSG),
  price: Yup.string().required(REQUIRED_INVALID_MSG),
});

const discountFormSchema = formSchema.shape({
  discount: Yup.string().required(REQUIRED_INVALID_MSG),
});

const OrderEditProductModal = () => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [sum, setSum] = useState<number>(0);
  const [quantity, setQuantity] = useState<string>('1');
  const [price, setPrice] = useState<string>('0');
  const [discount, setDiscount] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [orderProductId, setOrderProductId] = useState<string | number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, mode, orderProduct } = useAppSelector(
    (state) => state.modal.orderProductEditModal
  );

  const order = useAppSelector((state) => state.order.order);
  const orderProductsForCreate = useAppSelector(
    (state) => state.order.orderProductsForCreate
  );
  const employee = useAppSelector((state) => state.employee.employee);
  const favorites = useAppSelector((state) => state.order.favorites);

  const isDiscountFromOrder = discount === null;
  const isProductNotSelected = product === null;
  const isFavorite = favorites.some(
    (favorite) => favorite.productId === product?.id
  );

  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (isOpen && mode === MODES.EDIT_MODE && orderProduct?.product) {
      setProduct(orderProduct.product);
      setQuantity(orderProduct.quantity.toString());
      setPrice(orderProduct.price.toString());
      setDiscount(orderProduct.discount?.toString() || null);
      setComment(orderProduct.comment);
      setOrderProductId(orderProduct.id);
      setIsAdded(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const currectDiscount = product?.discountProhibited
      ? 0
      : discount || order.discount;
    const sumWithDiscount = calcSumWithDiscount(
      Number(currectDiscount),
      Number(quantity),
      Number(price)
    );
    setSum(sumWithDiscount);
  }, [quantity, price, discount]);

  const selectProduct = (product: IProduct) => {
    setProduct(product);
    setPrice(product.price.toString());

    if (!isAdded) {
      deleteOrderFiles();
      setOrderProductId(uuidv4());
    }
  };

  const addProduct = () => {
    if (mode === MODES.ADD_MODE) {
      const createdOrderProduct: IOrderProduct = {
        id: orderProductId,
        price: Number(price),
        quantity: Number(quantity),
        comment,
        folder: '',
        discount: discount ? Number(discount) : null,
        product: product || undefined,
      };

      dispatch(orderActions.addOrderProduct(createdOrderProduct));
      dispatch(orderActions.addOrderProductsForCreate(createdOrderProduct));
    } else {
      if (orderProduct) {
        const updatedOrderProduct: IOrderProduct = {
          ...orderProduct,
          id: orderProduct.id,
          price: Number(price),
          quantity: Number(quantity),
          comment,
          folder: orderProduct.folder,
          discount: discount ? Number(discount) : null,
          product: product || undefined,
        };

        dispatch(orderActions.updateOrderProduct(updatedOrderProduct));

        const isFoundForCreate = orderProductsForCreate.find(
          (x) => x.id === orderProduct.id
        );

        if (isFoundForCreate) {
          dispatch(orderActions.addOrderProductsForCreate(updatedOrderProduct));
        } else {
          dispatch(orderActions.addOrderProductsForUpdate(updatedOrderProduct));
        }
      }
    }

    closeModal(true);
  };

  const createFavorite = () => {
    if (!employee || !product) return;
    FavoriteAPI.create({
      productId: product.id,
      employeeId: employee.id,
    })
      .then((data) => {
        dispatch(orderActions.addFavorite(data));
      })
      .catch((e) =>
        toast(getErrorToast('OrderEditProductModal.createFavorite', e))
      );
  };

  const deleteFavorite = () => {
    if (!product) return;
    FavoriteAPI.delete({ productId: product.id })
      .then(() => {
        dispatch(orderActions.deleteFavoriteByProductId(product.id));
      })
      .catch((e) =>
        toast(getErrorToast('OrderEditProductModal.deleteFavorite', e))
      );
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      deleteFavorite();
    } else {
      createFavorite();
    }
  };

  const deleteOrderFiles = () => {
    dispatch(
      orderActions.deleteOrderFilePathForUploadByOrderProductId(orderProductId)
    );
    dispatch(orderActions.deleteOrderFilesByOrderProductId(orderProductId));
  };

  const closeModal = (orderProductAdded = isAdded) => {
    if (!orderProductAdded) {
      deleteOrderFiles();
    }

    setProduct(null);
    setQuantity('1');
    setPrice('0');
    setDiscount(null);
    setComment('');
    setOrderProductId(0);
    setIsLoading(false);
    setIsAdded(false);
    dispatch(modalActions.closeModal('orderProductEditModal'));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      blockScrollOnMount={false}
      size={favorites.length > 0 ? '4xl' : 'lg'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === MODES.ADD_MODE
            ? 'Добавление услуги'
            : 'Редактирование услуги'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className={styles.container}>
          <OrderFavoritesTable selectProduct={selectProduct} />
          <LoaderWrapper containerStyle={{ flex: 1.3 }} isLoading={isLoading}>
            <div className={styles.search_container}>
              <OrderProductSearch
                placeholder={
                  product
                    ? 'Заменить услугу — введите наименование'
                    : 'Добавить услугу — введите наименование'
                }
                style={{ width: '100%' }}
                onProductClick={selectProduct}
              />
              {product && (
                <IconButton
                  icon={
                    isFavorite ? (
                      <IconStarFilled size={ICON_SIZE} stroke={ICON_STROKE} />
                    ) : (
                      <IconStar size={ICON_SIZE} stroke={ICON_STROKE} />
                    )
                  }
                  aria-label="favorite"
                  isRound
                  onClick={toggleFavorite}
                />
              )}
            </div>
            <Heading size="lg" my="var(--space-lg)">
              {product?.name}
            </Heading>
            <Formik
              initialValues={{ quantity, price, discount, comment }}
              validationSchema={
                isDiscountFromOrder || product?.discountProhibited
                  ? formSchema
                  : discountFormSchema
              }
              enableReinitialize
              onSubmit={addProduct}
            >
              {() => (
                <Form className={styles.form}>
                  <div className={styles.form_columns}>
                    <Field name="quantity">
                      {({ meta }: FieldProps) => (
                        <FormControl isInvalid={!!meta.error && meta.touched}>
                          <FormLabel>Количество</FormLabel>
                          <NumberInput
                            value={quantity}
                            min={1}
                            onChange={setQuantity}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="price">
                      {({ meta }: FieldProps) => (
                        <FormControl isInvalid={!!meta.error && meta.touched}>
                          <FormLabel>Цена</FormLabel>
                          <NumberInput
                            value={price}
                            min={0}
                            isDisabled={isProductNotSelected}
                            onChange={setPrice}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </div>
                  {product?.discountProhibited ? (
                    <Text variant="secondary">
                      Скидка для данной услуги запрещена
                    </Text>
                  ) : (
                    <>
                      <FormControl
                        flexDirection="row"
                        display="flex"
                        alignItems="center"
                      >
                        <FormLabel mb={0}>Брать скидку из заказа</FormLabel>
                        <Switch
                          isChecked={isDiscountFromOrder}
                          onChange={() =>
                            setDiscount((prevState) =>
                              prevState === null ? '0' : null
                            )
                          }
                        />
                      </FormControl>
                      {!isDiscountFromOrder && (
                        <Field name="discount">
                          {({ meta }: FieldProps) => (
                            <FormControl
                              isInvalid={!!meta.error && meta.touched}
                            >
                              <FormLabel>Скидка</FormLabel>
                              <NumberInput
                                value={discount}
                                min={0}
                                max={100}
                                onChange={setDiscount}
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      )}
                    </>
                  )}
                  <Field name="comment">
                    {() => (
                      <FormControl>
                        <FormLabel>Комментарий</FormLabel>
                        <AutoResizableTextarea
                          value={comment}
                          placeholder="Комментарий"
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Badge textAlign="center">{`Сумма: ${parseFloat(
                    sum.toFixed(2)
                  )} руб.`}</Badge>
                  <div className={styles.footer}>
                    {product && <AttachFiles orderProductId={orderProductId} />}
                    <div className={styles.footer_section}>
                      <Button
                        className={styles.footer_button}
                        onClick={() => closeModal()}
                      >
                        Отмена
                      </Button>
                      <Button
                        className={styles.footer_button}
                        type="submit"
                        isDisabled={product === null}
                        colorScheme="yellow"
                      >
                        {mode === MODES.ADD_MODE ? 'Добавить' : 'Сохранить'}
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </LoaderWrapper>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrderEditProductModal;
