import { Button, Checkbox, Textarea, Textbox, UserCard } from 'components';
import { FC, useEffect, useState } from 'react';
import OrderDetailClientSearch from '../OrderDetailClientSearch/OrderDetailClientSearch';
import { IModal } from 'hooks/useModal';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { ButtonVariants } from 'components/UI/Button/Button';
import moment from 'moment';
import { INPUT_FORMAT } from 'constants/app';
import styles from './OrderDetailSidemenu.module.css';
import { orderSlice } from 'store/reducers/OrderSlice';
import { modalSlice } from 'store/reducers/ModalSlice';

interface OrderDetailSidemenuProps {
  sum: number;
  cancelOrderModal: IModal;
  saveOrder: () => void;
}

const OrderDetailSidemenu: FC<OrderDetailSidemenuProps> = ({
  sum,
  cancelOrderModal,
  saveOrder,
}) => {
  const [paid, setPaid] = useState<boolean>(false);

  const order = useAppSelector((state) => state.order.order);
  const beforeOrder = useAppSelector((state) => state.order.beforeOrder);
  const user = useAppSelector((state) => state.order.order.user);
  const prepayment = useAppSelector((state) => state.order.order.prepayment);
  const deadline = useAppSelector((state) => state.order.order.deadline);
  const comment = useAppSelector((state) => state.order.order.comment);
  const haveUnsavedData = useAppSelector(
    (state) => state.order.haveUnsavedData
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    JSON.stringify(order) != JSON.stringify(beforeOrder)
      ? dispatch(orderSlice.actions.setHaveUnsavedData(true))
      : dispatch(orderSlice.actions.setHaveUnsavedData(false));
  }, [order]);

  useEffect(() => {
    paidHandler();
  }, [sum]);

  useEffect(() => {
    paidHandler();
  }, [prepayment]);

  const paidHandler = () => {
    prepayment > 0 && sum === prepayment ? setPaid(true) : setPaid(false);
  };

  const openCancelModal = () => {
    cancelOrderModal.toggle();
  };

  const clearUser = () => {
    dispatch(orderSlice.actions.setOrderUser(null));
  };

  const openUserRegistrationModal = () => {
    dispatch(modalSlice.actions.openUserRegistrationModal(''));
  };

  return (
    <div className={styles.container}>
      <div className={styles.order_info}>
        <span className={styles.title}>????????????</span>
        <OrderDetailClientSearch style={{ marginBottom: '16px' }} />
        {user === null ? (
          <Button
            variant={ButtonVariants.primaryDeemphasized}
            onClick={openUserRegistrationModal}
          >
            ???????????????????????????????? ??????????????
          </Button>
        ) : (
          <UserCard user={user!} isEditable={true} close={clearUser} />
        )}

        <span className={styles.title} style={{ marginTop: '24px' }}>
          ?? ????????????
        </span>
        <span className={styles.sum}>?????????? ????????????: {sum} ??.</span>
        <div className={styles.paid_container}>
          <Checkbox
            text="???????????????? ??????????????????"
            checked={paid}
            onChange={() => dispatch(orderSlice.actions.setPrepayment(sum))}
          />
          {!paid && sum > 0 && (
            <span
              className={styles.remainder}
              style={sum - prepayment < 0 ? { color: '#eb5c5c' } : {}}
            >
              ??????????????: {sum - prepayment} ??.
            </span>
          )}
        </div>
        <Textbox
          label="????????????????????"
          type="number"
          min={0}
          max={sum}
          value={prepayment}
          onChange={(e) =>
            dispatch(orderSlice.actions.setPrepayment(Number(e.target.value)))
          }
        />
        <Textbox
          label="???????? ????????????"
          type="datetime-local"
          containerStyle={{ margin: '12px 0' }}
          value={moment(deadline).format(INPUT_FORMAT)}
          onChange={(e) =>
            dispatch(orderSlice.actions.setDeadline(e.target.value))
          }
        />
        <Textarea
          label="??????????????????????"
          style={{ resize: 'vertical' }}
          value={comment}
          onChange={(e) =>
            dispatch(orderSlice.actions.setComment(e.target.value))
          }
        />
      </div>

      <div className={styles.order_control}>
        {haveUnsavedData && (
          <Button style={{ marginRight: '8px' }} onClick={openCancelModal}>
            ????????????????
          </Button>
        )}
        <Button
          variant={ButtonVariants.primary}
          disabled={!haveUnsavedData}
          onClick={saveOrder}
        >
          ??????????????????
        </Button>
      </div>
    </div>
  );
};

export default OrderDetailSidemenu;
