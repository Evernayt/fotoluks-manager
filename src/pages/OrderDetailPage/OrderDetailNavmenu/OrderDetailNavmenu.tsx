import logoBird from '../../../../assets/logo-bird.png';
import { Button, CircleButton, DropdownButton } from 'components';
import { IconClose } from 'icons';
import { useNavigate } from 'react-router-dom';
import { IModal } from 'hooks/useModal';
import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import styles from './OrderDetailNavmenu.module.css';
import { orderSlice } from 'store/reducers/OrderSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import socketio from 'socket/socketio';
import { IWatcher } from 'models/IWatcher';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import OrderDetailWatchers from './OrderDetailWatchers/OrderDetailWatchers';

interface OrderDetailNavmenuProps {
  unsavedDataModal: IModal;
}

const OrderDetailNavmenu: FC<OrderDetailNavmenuProps> = ({
  unsavedDataModal,
}) => {
  const [orderWatchers, setOrderWatchers] = useState<IWatcher[]>([]);

  const order = useAppSelector((state) => state.order.order);
  const haveUnsavedData = useAppSelector(
    (state) => state.order.haveUnsavedData
  );
  const watchers = useAppSelector((state) => state.order.watchers);
  const user = useAppSelector((state) => state.user.user);

  const title = order?.id === 0 ? 'Новый заказ' : `Заказ № ${order?.id}`;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (order.id !== 0) {
      const filteredWatchers = watchers.filter(
        (x) => x.orderId === order.id && x.user.id !== user?.id
      );
      setOrderWatchers(filteredWatchers);
    }
  }, [watchers, order.id]);

  const closeOrderDetail = () => {
    if (haveUnsavedData) {
      openUnsavedDataModal();
    } else {
      dispatch(orderSlice.actions.clearOrder());
      navigate(-1);

      if (user) {
        socketio.removeWatcher(user.id);
      }
    }
  };

  const openUnsavedDataModal = () => {
    unsavedDataModal.toggle();
  };

  const openMembersModal = () => {
    dispatch(modalSlice.actions.openOrderMembersModal());
  };

  return (
    <div className={styles.container}>
      <div className={styles.left_section}>
        <CircleButton
          className={styles.close_btn}
          icon={<IconClose className="secondary-dark-icon" />}
          onClick={closeOrderDetail}
        />
        <img className={styles.logo} src={logoBird} alt="logo" />
      </div>
      <div className={styles.center_section}>
        <span style={{ fontSize: '18px', fontWeight: '500' }}>{title}</span>
      </div>
      <div className={styles.right_section}>
        {orderWatchers.length > 0 && (
          <DropdownButton
            placement={Placements.bottomEnd}
            text={`Смотрят: ${orderWatchers.length}`}
            variant={DropdownButtonVariants.primaryDeemphasized}
            itemRender={() => <OrderDetailWatchers watchers={orderWatchers} />}
          />
        )}
        <Button onClick={openMembersModal}>
          Участники: {order.orderMembers.length}
        </Button>
      </div>
    </div>
  );
};

export default OrderDetailNavmenu;
