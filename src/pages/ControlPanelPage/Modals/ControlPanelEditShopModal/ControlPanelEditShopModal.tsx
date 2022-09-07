import { Button, Modal, Textarea, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { createShopAPI, fetchShopAPI, updateShopAPI } from 'http/shopAPI';
import { IShop } from 'models/IShop';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditShopModal.module.css';

const ControlPanelEditShopModal = () => {
  const [shop, setShop] = useState<IShop>();
  const [shopName, setShopName] = useState<string>('');
  const [shopDescription, setShopDescription] = useState<string>('');
  const [shopAddress, setShopAddress] = useState<string>('');

  const controlPanelEditShopModal = useAppSelector(
    (state) => state.modal.controlPanelEditShopModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (controlPanelEditShopModal.isShowing) {
      if (controlPanelEditShopModal.mode === Modes.EDIT_MODE) {
        fetchShop();
      }
    }
  }, [controlPanelEditShopModal.isShowing]);

  const fetchShop = () => {
    fetchShopAPI(controlPanelEditShopModal.shopId).then((data) => {
      setShop(data);
      setShopName(data.name);
      setShopDescription(data.description);
      setShopAddress(data.address);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeControlPanelEditShopModal());

    setShop(undefined);
    setShopName('');
    setShopDescription('');
    setShopAddress('');
  };

  const updateShop = () => {
    if (shop) {
      const updatedShop: IShop = {
        ...shop,
        name: shopName,
        description: shopDescription,
        address: shopAddress,
      };
      updateShopAPI(updatedShop).then(() => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        close();
      });
    }
  };

  const createShop = () => {
    createShopAPI(shopName, shopDescription, shopAddress).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  return (
    <Modal
      title={
        controlPanelEditShopModal.mode === Modes.EDIT_MODE
          ? 'Редактирование'
          : 'Новый филиал'
      }
      isShowing={controlPanelEditShopModal.isShowing}
      hide={close}
    >
      <div>
        <Textbox
          label="Наименование"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />
        <Textarea
          label="Описание"
          value={shopDescription}
          onChange={(e) => setShopDescription(e.target.value)}
          containerStyle={{ margin: '12px 0', minWidth: '310px' }}
        />
        <Textbox
          label="Адрес"
          value={shopAddress}
          onChange={(e) => setShopAddress(e.target.value)}
        />

        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          {controlPanelEditShopModal.mode === Modes.ADD_MODE ? (
            <Button variant={ButtonVariants.primary} onClick={createShop}>
              Создать
            </Button>
          ) : (
            <Button variant={ButtonVariants.primary} onClick={updateShop}>
              Изменить
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ControlPanelEditShopModal;
