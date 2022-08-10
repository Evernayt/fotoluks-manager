import { Button, MaskedTextbox, Modal, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { updateUserAPI } from 'http/userAPI';
import { isVerifiedAPI } from 'http/verificationAPI';
import { IUser } from 'models/IUser';
import { useEffect, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import { orderSlice } from 'store/reducers/OrderSlice';
import styles from './EditUserModal.module.css';

const EditUserModal = () => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [vk, setVk] = useState<string>('');
  const [telegram, setTelegram] = useState<string>('');
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  const editUserModal = useAppSelector((state) => state.modal.editUserModal);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editUserModal.isShowing) {
      isVerified();
    }
  }, [editUserModal.isShowing]);

  const isVerified = () => {
    isVerifiedAPI(editUserModal.phone).then((data) => {
      setIsPhoneVerified(data.phoneVerified);
      setName(data.user.name);
      setPhone(data.user.phone ? data.user.phone : '');
      setEmail(data.user.email ? data.user.email : '');
      setVk(data.user.vk ? data.user.vk : '');
      setTelegram(data.user.telegram ? data.user.telegram : '');
      setUser(data.user);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeEditUserModal());
    setIsPhoneVerified(false);
    setName('');
    setPhone('');
    setEmail('');
    setVk('');
    setTelegram('');
    setUser(null);
  };

  const updateUser = () => {
    if (user !== null) {
      const editedUser: IUser = {
        ...user,
        login: phone,
        name,
        phone,
        email: email === '' ? null : email,
        vk: vk === '' ? null : vk,
        telegram: telegram === '' ? null : telegram,
      };
      updateUserAPI(editedUser).then((data) => {
        dispatch(orderSlice.actions.setOrderUser(data));
        close();
      });
    }
  };

  return (
    <Modal
      title="Редактирование"
      isShowing={editUserModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        {isPhoneVerified && (
          <div className={styles.message}>
            {`Пользователь активировал аккаунт.\nНекоторые данные изменить нельзя.`}
          </div>
        )}
        <div className={styles.main_controls}>
          <Textbox
            label="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPhoneVerified}
          />
          <MaskedTextbox
            label="Телефон"
            value={phone}
            setValue={setPhone}
            mask="8 (999) 999-99-99"
            disabled={isPhoneVerified}
          />
        </div>
        <div className={styles.social}>
          <Textbox
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Textbox
            label="ВКонтакте"
            value={vk}
            onChange={(e) => setVk(e.target.value)}
          />
          <Textbox
            label="Telegram"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
          />
        </div>
        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          <Button
            variant={ButtonVariants.primary}
            disabled={name === '' || phone.length < 11}
            onClick={updateUser}
          >
            Изменить
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditUserModal;
