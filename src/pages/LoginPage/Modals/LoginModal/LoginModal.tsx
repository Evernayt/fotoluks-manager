import AuthAPI from 'api/AuthAPI/AuthAPI';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { Button, Modal, Textbox } from 'components';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import { ButtonVariants } from 'components/UI/Button/Button';
import { defaultAvatar } from 'constants/images';
import { enterPressHandler, getApps } from 'helpers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { KeyboardEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socketio from 'socket/socketio';
import { employeeSlice } from 'store/reducers/EmployeeSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { moyskladSlice } from 'store/reducers/MoyskladSlice';
import styles from './LoginModal.module.scss';

const LoginModal = () => {
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const activeShop = useAppSelector((state) => state.app.activeShop);
  const loginModal = useAppSelector((state) => state.modal.loginModal);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fetchStores = () => {
    MoyskladAPI.getStores().then((data) => {
      dispatch(moyskladSlice.actions.setStores(data.rows));

      const activeStore = data.rows.find((store) =>
        store.name.includes(activeShop.name)
      );
      if (activeStore) {
        dispatch(moyskladSlice.actions.setActiveStore(activeStore));
      }
    });
  };

  const signIn = () => {
    if (!loginModal.employee) return;

    setIsLoading(true);
    AuthAPI.login({ login: loginModal.employee.login, password })
      .then((data) => {
        const apps = getApps(data.apps);
        if (!apps.length) {
          showGlobalMessage('Нет доступных приложений');
          return;
        }

        socketio.connect();
        fetchStores();

        dispatch(employeeSlice.actions.signIn(data));
        navigate(apps[0].value);
        close();
      })
      .catch((e) => {
        showGlobalMessage(
          e.response.data ? e.response.data.message : e.message
        );
      })
      .finally(() => setIsLoading(false));
  };

  const onEnterPress = (event: KeyboardEvent) => {
    if (password !== '') {
      enterPressHandler(event, signIn);
    }
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('loginModal'));
    setPassword('');
  };

  return (
    <Modal
      title=""
      isShowing={loginModal.isShowing}
      hide={close}
      separator={false}
    >
      <div className={styles.container}>
        <img
          className={styles.avatar}
          src={
            loginModal.employee?.avatar
              ? loginModal.employee.avatar
              : defaultAvatar
          }
        />
        <div className={styles.name}>{loginModal.employee?.name}</div>
        <Textbox
          label="Пароль"
          value={password}
          isPassword
          onChange={(e) => setPassword(e.target.value)}
          onKeyUp={onEnterPress}
        />
        <Button
          className={styles.login_button}
          variant={ButtonVariants.primary}
          onClick={signIn}
          disabled={password === ''}
          isLoading={isLoading}
          loadingText="Авторизация..."
        >
          Войти
        </Button>
      </div>
    </Modal>
  );
};

export default LoginModal;
