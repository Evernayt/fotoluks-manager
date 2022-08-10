import { Button, Modal, SelectButton } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { updateShopAPI } from 'http/orderAPI';
import { fetchShopsAPI } from 'http/shopAPI';
import { IShop } from 'models/IShop';
import { useEffect, useState } from 'react';
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
    updateShopAPI(orderShopModal.orderId, selectedShop.id).then(() => {
      dispatch(orderSlice.actions.setForceUpdate(true));
      close();
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
        <SelectButton
          items={shops}
          defaultSelectedItem={selectedShop}
          changeHandler={setSelectedShop}
          style={{ width: '100%' }}
        />
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
