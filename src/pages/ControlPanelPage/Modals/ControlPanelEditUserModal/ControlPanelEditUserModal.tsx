import {
  Button,
  MaskedTextbox,
  Modal,
  SelectButton,
  Textbox,
  Tooltip,
} from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { Modes } from 'constants/app';
import { defaultAvatar } from 'constants/images';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchShopsAPI } from 'http/shopAPI';
import { fetchUserAPI, registrationAPI, updateUserAPI } from 'http/userAPI';
import { isVerifiedAPI } from 'http/verificationAPI';
import { GlobalMessageVariants } from 'models/IGlobalMessage';
import { IShop } from 'models/IShop';
import { IRole, IUser, UserRoles } from 'models/IUser';
import { useEffect, useMemo, useState } from 'react';
import { appSlice } from 'store/reducers/AppSlice';
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
  const [shops, setShops] = useState<IShop[]>([]);
  const [selectedShop, setSelectedShop] = useState<IShop>(shops[0]);

  const controlPanelEditUserModal = useAppSelector(
    (state) => state.modal.controlPanelEditUserModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (controlPanelEditUserModal.isShowing) {
      if (controlPanelEditUserModal.mode === Modes.EDIT_MODE) {
        fetchUser();
      }

      fetchShops();
    }
  }, [controlPanelEditUserModal.isShowing]);

  const fetchUser = () => {
    fetchUserAPI(controlPanelEditUserModal.userId).then((data) => {
      setName(data.name);
      setPhone(data.phone);
      setLogin(data.login);
      setPassword(data.password ? data.password : '');
      setAvatar(data.avatar);

      const role = roles.find((x) => x.role === data.role);
      if (role !== undefined) setSelectedRole(role);

      setEmail(data.email);
      setVk(data.vk);
      setTelegram(data.telegram);
      setSelectedShop(data.shop ? data.shop : shops[0]);
      setUser(data);

      isVerifiedAPI(data.phone).then((data2) => {
        setIsPhoneVerified(data2.phoneVerified);
      });
    });
  };

  const fetchShops = () => {
    fetchShopsAPI(100, 1, true).then((data) => {
      setShops(data.rows);
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
    setSelectedShop(shops[0]);
    setEmail('');
    setVk('');
    setTelegram('');
    setUser(null);
  };

  const updateUser = () => {
    if (!selectedShop) {
      dispatch(
        appSlice.actions.showGlobalMessage({
          message: 'Выберите филиал',
          variant: GlobalMessageVariants.warning,
          isShowing: true,
        })
      );
      return;
    }

    if (user) {
      const updatedUser: IUser = {
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
        shopId: selectedShop.id,
      };
      updateUserAPI(updatedUser)
        .then(() => {
          dispatch(controlPanelSlice.actions.setForceUpdate(true));
          close();
        })
        .catch((e) =>
          dispatch(
            appSlice.actions.showGlobalMessage({
              message: e.response.data.message,
              variant: GlobalMessageVariants.danger,
              isShowing: true,
            })
          )
        );
    }
  };

  const createUser = () => {
    if (!selectedShop) {
      dispatch(
        appSlice.actions.showGlobalMessage({
          message: 'Выберите филиал',
          variant: GlobalMessageVariants.warning,
          isShowing: true,
        })
      );
      return;
    }

    const createdUser: IUser = {
      id: 0,
      name,
      login,
      password,
      phone,
      role: selectedRole.role!,
      email,
      vk,
      telegram,
      avatar,
      shopId: selectedShop.id,
    };
    registrationAPI(createdUser)
      .then(() => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        close();
      })
      .catch((e) =>
        dispatch(
          appSlice.actions.showGlobalMessage({
            message: e.response.data.message,
            variant: GlobalMessageVariants.danger,
            isShowing: true,
          })
        )
      );
  };

  return (
    <Modal
      title={
        controlPanelEditUserModal.mode === Modes.EDIT_MODE
          ? 'Редактирование'
          : 'Новый пользователь'
      }
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

        <div className={styles.controls}>
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
        <div className={styles.controls}>
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
        <div className={styles.controls}>
          <Tooltip label="Роль">
            <div style={{ width: '100%' }}>
              <SelectButton
                items={roles}
                defaultSelectedItem={selectedRole}
                changeHandler={(e) => setSelectedRole(e)}
                style={{ width: '100%' }}
              />
            </div>
          </Tooltip>
          <Tooltip label="Филиал">
            <div style={{ width: '100%' }}>
              <SelectButton
                items={shops}
                defaultSelectedItem={selectedShop}
                changeHandler={(e) => setSelectedShop(e)}
                style={{ width: '100%' }}
              />
            </div>
          </Tooltip>
        </div>

        <Textbox
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className={styles.controls}>
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
        <Textbox
          label="Аватар (URL)"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          {controlPanelEditUserModal.mode === Modes.ADD_MODE ? (
            <Button
              variant={ButtonVariants.primary}
              disabled={
                name === '' ||
                phone.length < 11 ||
                login === '' ||
                password === ''
              }
              onClick={createUser}
            >
              Создать
            </Button>
          ) : (
            <Button
              variant={ButtonVariants.primary}
              disabled={
                name === '' ||
                phone.length < 11 ||
                login === '' ||
                password === ''
              }
              onClick={updateUser}
            >
              Изменить
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ControlPanelEditUserModal;
