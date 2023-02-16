import { UpdateShopDto } from 'api/ShopAPI/dto/update-shop.dto';
import ShopAPI from 'api/ShopAPI/ShopAPI';
import { Button, Modal, Textarea, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IShop } from 'models/api/IShop';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditShopModal.module.scss';

const ControlPanelEditShopModal = () => {
  const [shop, setShop] = useState<IShop>();
  const [name, setName] = useState<string>('');
  const [abbreviation, setAbbreviation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const editShopModal = useAppSelector(
    (state) => state.modal.controlPanelEditShopModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editShopModal.isShowing) {
      if (editShopModal.mode === Modes.EDIT_MODE) {
        fetchShop();
      }
    }
  }, [editShopModal.isShowing]);

  const fetchShop = () => {
    ShopAPI.getOne(editShopModal.shopId).then((data) => {
      setShop(data);
      setName(data.name);
      setAbbreviation(data.abbreviation);
      setDescription(data.description);
      setAddress(data.address);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('controlPanelEditShopModal'));

    setShop(undefined);
    setName('');
    setAbbreviation('');
    setDescription('');
    setAddress('');
  };

  const updateShop = () => {
    if (shop) {
      const updatedShop: UpdateShopDto = {
        id: shop.id,
        name,
        abbreviation,
        description,
        address,
      };

      ShopAPI.update(updatedShop).then(() => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        close();
      });
    }
  };

  const createShop = () => {
    ShopAPI.create({ name, abbreviation, description, address }).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  return (
    <Modal
      title={
        editShopModal.mode === Modes.EDIT_MODE
          ? 'Редактирование'
          : 'Новый филиал'
      }
      isShowing={editShopModal.isShowing}
      hide={close}
    >
      <div>
        <div className={styles.controls_container}>
          <Textbox
            label="Наименование"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textbox
            label="Аббревиатура"
            value={abbreviation}
            onChange={(e) => setAbbreviation(e.target.value)}
          />
          <Textarea
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Textbox
            label="Адрес"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          {editShopModal.mode === Modes.ADD_MODE ? (
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
