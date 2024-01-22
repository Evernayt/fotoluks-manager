import { useAppSelector } from 'hooks/redux';
import OrderProductContextMenu from './context-menu/OrderProductContextMenu';
import OrderProduct from './order-product/OrderProduct';
import styles from './OrderProducts.module.scss';

const OrderProducts = () => {
  const orderProducts = useAppSelector(
    (state) => state.order.order.orderProducts
  );
  const order = useAppSelector((state) => state.order.order);

  return (
    <div className={styles.container}>
      <OrderProductContextMenu />
      <div className={styles.products}>
        {orderProducts?.map((orderProduct) => (
          <OrderProduct
            orderProduct={orderProduct}
            orderDiscount={order.discount}
            key={orderProduct.id}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderProducts;
