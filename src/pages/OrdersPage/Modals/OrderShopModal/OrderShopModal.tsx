import { Button, Modal, SelectButton, Tooltip } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { createNotificationAPI } from 'http/notificationAPI';
import { updateShopAPI } from 'http/orderAPI';
import { fetchShopsAPI } from 'http/shopAPI';
import { IShop } from 'models/IShop';
import { useEffect, useState } from 'react';
import socketio from 'socket/socketio';
import { modalSlice } from 'store/reducers/ModalSlice';
import { orderSlice } from 'store/reducers/OrderSlice';
import styles from './OrderShopModal.module.css';

const OrderShopModal = () => {
  const initialShop: IShop = {
    id: 0,
    name: 'Выберите филиал',
    address: '',
    description: '',
  };

  const [shops, setShops] = useState<IShop[]>([]);
  const [selectedShop, setSelectedShop] = useState<IShop>(initialShop);

  const orderShopModal = useAppSelector((state) => state.modal.orderShopModal);
  const user = useAppSelector((state) => state.user.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = () => {
    fetchShopsAPI(true).then((data) => {
      setShops(data);
    });
  };

  const updateShop = () => {
    if (!orderShopModal.order) return;

    updateShopAPI(orderShopModal.order.id, selectedShop.id).then(() => {
      dispatch(orderSlice.actions.setForceUpdate(true));
      close();

      notifyShopUpdate();
    });
  };

  const notifyShopUpdate = () => {
    const order = orderShopModal.order;
    if (!order) return;
    if (order.orderMembers.length === 0) return;

    const orderMemberIds = [];
    for (let i = 0; i < order.orderMembers.length; i++) {
      orderMemberIds.push(order.orderMembers[i].user.id);
    }

    const title = 'Заказ перемещен';
    const text = `${user?.name} переместил заказ № ${order.id} c филиала "${order.shop?.name}" на "${selectedShop.name}"`;

    createNotificationAPI(title, text, orderMemberIds).then((data) => {
      socketio.sendNotification(data);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeOrderShopModal());
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
              changeHandler={setSelectedShop}
              style={{ width: '100%' }}
            />
          </div>
        </Tooltip>
      </div>
      <div className={styles.controls}>
        <Button
          variant={ButtonVariants.primary}
          onClick={updateShop}
          disabled={selectedShop.id === 0}
        >
          Переместить
        </Button>
      </div>
    </Modal>
  );
};

export default OrderShopModal;
