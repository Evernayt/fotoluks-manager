import { Button, Modal } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch } from 'hooks/redux';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderSlice } from 'store/reducers/OrderSlice';
import styles from './OrderDetailUnsavedDataModal.module.css';

interface OrderDetailUnsavedDataModalProps {
  isShowing: boolean;
  hide: () => void;
  saveOrder: () => void;
}

const OrderDetailUnsavedDataModal: FC<OrderDetailUnsavedDataModalProps> = ({
  isShowing,
  hide,
  saveOrder,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const closeOrder = () => {
    hide();
    dispatch(orderSlice.actions.clearOrder());
    navigate(-1);
  };

  const saveOrderAndClose = () => {
    saveOrder();
    closeOrder();
  };

  return (
    <Modal title="Сохранить изменения?" isShowing={isShowing} hide={hide}>
      <span className={styles.message}>Есть не сохраненные данные.</span>
      <div className={styles.controls}>
        <Button style={{ minWidth: 'max-content' }} onClick={hide}>
          Продолжить редактирование
        </Button>
        <Button style={{ margin: '0 8px' }} onClick={closeOrder}>
          Нет
        </Button>
        <Button variant={ButtonVariants.primary} onClick={saveOrderAndClose}>
          Да
        </Button>
      </div>
    </Modal>
  );
};

export default OrderDetailUnsavedDataModal;
