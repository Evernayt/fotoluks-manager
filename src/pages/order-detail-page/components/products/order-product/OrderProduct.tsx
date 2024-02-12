import { Card, CardBody, Heading, Text } from '@chakra-ui/react';
import { IOrderProduct } from 'models/api/IOrderProduct';
import { FC, useDeferredValue } from 'react';
import { useAppDispatch } from 'hooks/redux';
import { useContextMenu } from 'react-contexify';
import { ORDER_PRODUCT_MENU_ID } from '../context-menu/OrderProductContextMenu';
import { modalActions } from 'store/reducers/ModalSlice';
import { MODES } from 'constants/app';
import { noImage } from 'constants/images';
import { calcSumWithDiscount } from 'pages/order-detail-page/OrderDetailPage.service';
import styles from './OrderProduct.module.scss';

interface OrderProductProps {
  orderProduct: IOrderProduct;
  orderDiscount: number;
}

const OrderProduct: FC<OrderProductProps> = ({
  orderProduct,
  orderDiscount,
}) => {
  const deferredDiscount = useDeferredValue(orderProduct.discount);

  const currectDiscount = orderProduct.product?.discountProhibited
    ? 0
    : deferredDiscount || orderDiscount;
  const sumWithDiscount = calcSumWithDiscount(
    currectDiscount,
    orderProduct.quantity,
    orderProduct.price
  );

  const dispatch = useAppDispatch();
  const { show } = useContextMenu({ id: ORDER_PRODUCT_MENU_ID });

  const openEditProductModal = (orderProduct: IOrderProduct) => {
    dispatch(
      modalActions.openModal({
        modal: 'orderProductEditModal',
        props: { mode: MODES.EDIT_MODE, orderProduct },
      })
    );
  };

  const handleContextMenu = (orderProduct: IOrderProduct, event: any) => {
    show({ event, props: orderProduct });
  };

  return (
    <Card
      className={styles.container}
      onClick={() => openEditProductModal(orderProduct)}
      onContextMenu={(e) => handleContextMenu(orderProduct, e)}
    >
      <CardBody className={styles.body}>
        <div className={styles.header}>
          <img
            className={styles.image}
            src={orderProduct.product?.image || noImage}
          />
          <div>
            <Heading size="sm" mb="var(--space-xs)">
              {orderProduct.product?.name}
            </Heading>
            <Text variant="secondary" fontSize="sm">
              {`Цена: ${orderProduct.price} руб. | Сумма: ${parseFloat(
                sumWithDiscount.toFixed(2)
              )} руб.`}
            </Text>
            <Text variant="secondary" fontSize="sm">
              {`Количество: ${orderProduct.quantity} шт.`}
            </Text>
          </div>
        </div>
        {orderProduct.comment && (
          <Text mt="var(--space-sm)">{orderProduct.comment}</Text>
        )}
      </CardBody>
    </Card>
  );
};

export default OrderProduct;
