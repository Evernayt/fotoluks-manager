import {
  Button,
  MaskedTextbox,
  Modal,
  SelectButton,
  Textbox,
} from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { defaultAvatar } from 'constants/images';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { updateUserAPI } from 'http/userAPI';
import { isVerifiedAPI } from 'http/verificationAPI';
import { IRole, IUser, UserRoles } from 'models/IUser';
import { useEffect, useMemo, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditUserModal.module.css';

const ControlPanelEditUserModal = () => {
  const roles = useMemo<IRole[]>(
    () => [
      {
        id: 0,
        name: 'Админ',
        role: UserRoles.ADMIN,
      },
      {
        id: 1,
        name: 'Сотрудник',
        role: UserRoles.EMPLOYEE,
      },
      {
        id: 2,
        name: 'Клиент',
        role: UserRoles.USER,
      },
    ],
    []
  );

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [vk, setVk] = useState<string>('');
  const [telegram, setTelegram] = useState<string>('');
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<IRole>(roles[2]);

  const controlPanelEditUserModal = useAppSelector(
    (state) => state.modal.controlPanelEditUserModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (controlPanelEditUserModal.isShowing) {
      isVerified();
    }
  }, [controlPanelEditUserModal.isShowing]);

  const isVerified = () => {
    isVerifiedAPI(controlPanelEditUserModal.phone).then((data) => {
      setIsPhoneVerified(data.phoneVerified);
      setName(data.user.name);
      setPhone(data.user.phone);
      setLogin(data.user.login);
      setPassword(data.user.password ? data.user.password : '');
      setAvatar(data.user.avatar);

      const role = roles.find((x) => x.role === data.user.role);
      if (role !== undefined) setSelectedRole(role);

      setEmail(data.user.email);
      setVk(data.user.vk);
      setTelegram(data.user.telegram);
      setUser(data.user);
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeControlPanelEditUserModal());
    setIsPhoneVerified(false);
    setName('');
    setPhone('');
    setLogin('');
    setPassword('');
    setAvatar('');
    setSelectedRole(roles[2]);
    setEmail('');
    setVk('');
    setTelegram('');
    setUser(null);
  };

  const updateUser = () => {
    if (user !== null) {
      const editedUser: IUser = {
        ...user,
        login,
        password,
        name,
        phone,
        role: selectedRole.role!,
        email,
        vk,
        telegram,
        avatar,
      };
      updateUserAPI(editedUser).then(() => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        close();
      });
    }
  };

  return (
    <Modal
      title="Редактирование"
      isShowing={controlPanelEditUserModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <div className={styles.avatar_container}>
          <img
            className={styles.avatar}
            src={avatar === '' ? defaultAvatar : avatar}
          />
          {isPhoneVerified && (
            <div className={styles.message}>
              {`Пользователь активировал аккаунт.\nНекоторые данные изменить нельзя.`}
              <Button
                variant={ButtonVariants.link}
                style={{ width: 'max-content', padding: 0 }}
                onClick={() => setIsPhoneVerified(false)}
              >
                Разблокировать
              </Button>
            </div>
          )}
        </div>

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
        <div className={styles.main_controls}>
          <Textbox
            label="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            disabled={isPhoneVerified}
          />
          <Textbox
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPhoneVerified}
            isPassword
          />
        </div>
        <div className={styles.social}>
          <SelectButton
            items={roles}
            defaultSelectedItem={selectedRole}
            changeHandler={(e) => setSelectedRole(e)}
            style={{ width: '100%' }}
          />
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
          <Textbox
            label="Аватар (URL)"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
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

export default ControlPanelEditUserModal;
