import { Button, Modal } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import {
  removeNotAvailableGoods,
  removeOrderedGoods,
} from 'helpers/localStorage';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { endingGoodsSlice } from 'store/reducers/EndingGoodsSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './EndingGoodsClearOrderedModal.module.scss';

const EndingGoodsClearOrderedModal = () => {
  const clearOrderedModal = useAppSelector(
    (state) => state.modal.endingGoodsClearOrderedModal
  );

  const dispatch = useAppDispatch();

  const clear = () => {
    removeOrderedGoods();
    removeNotAvailableGoods();
    dispatch(endingGoodsSlice.actions.setOrderedGoods([]));
    dispatch(endingGoodsSlice.actions.setNotAvailableGoods([]));
    dispatch(endingGoodsSlice.actions.setForceUpdate(true));
    close();
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('endingGoodsClearOrderedModal'));
  };

  return (
    <Modal
      title="Очистить заказанное?"
      isShowing={clearOrderedModal.isShowing}
      hide={close}
    >
      <div className={styles.controlls}>
        <Button onClick={close}>Нет</Button>
        <Button variant={ButtonVariants.primary} onClick={clear}>
          Да
        </Button>
      </div>
    </Modal>
  );
};

export default EndingGoodsClearOrderedModal;
