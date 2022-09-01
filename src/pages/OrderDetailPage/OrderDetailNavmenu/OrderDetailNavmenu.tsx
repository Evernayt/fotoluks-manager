import logoBird from '../../../../assets/logo-bird.png';
import { Button, CircleButton } from 'components';
import { closeIcon } from 'icons';
import { useNavigate } from 'react-router-dom';
import { IModal } from 'hooks/useModal';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import styles from './OrderDetailNavmenu.module.css';
import { orderSlice } from 'store/reducers/OrderSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { ButtonVariants } from 'components/UI/Button/Button';
import socketio from 'socket/socketio';

interface OrderDetailNavmenuProps {
  unsavedDataModal: IModal;
}

const OrderDetailNavmenu: FC<OrderDetailNavmenuProps> = ({
  unsavedDataModal,
}) => {
  const order = useAppSelector((state) => state.order.order);
  const haveUnsavedData = useAppSelector(
    (state) => state.order.haveUnsavedData
  );
  const watchers = useAppSelector((state) => state.order.watchers);
  const user = useAppSelector((state) => state.user.user);

  const title = order?.id === 0 ? 'Новый заказ' : `Заказ № ${order?.id}`;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
          icon={closeIcon}
          style={{ marginRight: '8px', backgroundColor: '#999999' }}
          onClick={closeOrderDetail}
        />
        <img className={styles.logo} src={logoBird} alt="logo" />
      </div>
      <div className={styles.center_section}>
        <span style={{ fontSize: '18px', fontWeight: '500' }}>{title}</span>
      </div>
      <div className={styles.right_section}>
        {watchers.length > 0 && (
          <Button variant={ButtonVariants.primaryDeemphasized}>
            Смотрят: {watchers.length}
          </Button>
        )}
        <Button onClick={openMembersModal}>
          Участники: {order.orderMembers.length}
        </Button>
      </div>
    </div>
  );
};

export default OrderDetailNavmenu;
