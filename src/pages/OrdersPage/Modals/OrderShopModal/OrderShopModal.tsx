import NotificationAPI from 'api/NotificationAPI/NotificationAPI';
import OrderAPI from 'api/OrderAPI/OrderAPI';
import ShopAPI from 'api/ShopAPI/ShopAPI';
import { Button, Modal, SelectButton, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { INITIAL_SHOP } from 'constants/states/shop-states';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IShop } from 'models/api/IShop';
import { useEffect, useState } from 'react';
import socketio from 'socket/socketio';
import { modalSlice } from 'store/reducers/ModalSlice';
import { orderSlice } from 'store/reducers/OrderSlice';
import styles from './OrderShopModal.module.scss';

const OrderShopModal = () => {
  const [shops, setShops] = useState<IShop[]>([]);
  const [selectedShop, setSelectedShop] = useState<IShop>(INITIAL_SHOP);

  const orderShopModal = useAppSelector((state) => state.modal.orderShopModal);
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = () => {
    ShopAPI.getAll({ isIncludeGeneral: true }).then((data) => {
      setShops(data.rows);
    });
  };

  const editShop = () => {
    if (!orderShopModal.order) return;

    const orderId = orderShopModal.order.id;
    const shopId = selectedShop.id;
    OrderAPI.editShop({ orderId, shopId }).then(() => {
      dispatch(orderSlice.actions.setForceUpdate(true));
      close();

      notifyShopUpdate();
    });
  };

  const notifyShopUpdate = () => {
    const order = orderShopModal.order;
    if (!order) return;
    if (!order.orderMembers?.length) return;

    const employeeIds = [];
    for (let i = 0; i < order.orderMembers.length; i++) {
      employeeIds.push(order.orderMembers[i].employee.id);
    }

    const title = 'Заказ перемещен';
    const text = `${employee?.name} переместил заказ № ${order.id} c филиала «${order.shop?.name}» на «${selectedShop.name}»`;

    NotificationAPI.create({ title, text, employeeIds }).then((data) => {
      socketio.sendNotification(data);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('orderShopModal'));
  };

  return (
    <Modal
      title="Перемещение"
      isShowing={orderShopModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <Tooltip label="Филиал">
          <div>
            <SelectButton
              items={shops}
              defaultSelectedItem={selectedShop}
              onChange={setSelectedShop}
              style={{ width: '100%' }}
            />
          </div>
        </Tooltip>
      </div>
      <div className={styles.controls}>
        <Button
          variant={ButtonVariants.primary}
          onClick={editShop}
          disabled={selectedShop.id === 0}
        >
          Переместить
        </Button>
      </div>
    </Modal>
  );
};

export default OrderShopModal;
