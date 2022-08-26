import { Button, Modal, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { defaultAvatar } from 'constants/images';
import { ORDERS_ROUTE } from 'constants/paths';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { loginAPI } from 'http/userAPI';
import { UserRoles } from 'models/IUser';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socketio from 'socket/socketio';
import { appSlice } from 'store/reducers/AppSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { userSlice } from 'store/reducers/UserSlice';
import styles from './LoginModal.module.css';

const LoginModal = () => {
  const [password, setPassword] = useState<string>('');

  const loginModal = useAppSelector((state) => state.modal.loginModal);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const close = () => {
    dispatch(modalSlice.actions.closeLoginModal());

    setPassword('');
  };

  const signIn = () => {
    if (!loginModal.user) return;

    loginAPI(loginModal.user.login, password)
      .then((data) => {
        if (data.role === UserRoles.USER) {
          console.log('Нет доступа');
          return;
        }

        socketio.connect(data);
        dispatch(userSlice.actions.signIn(data));
        navigateToRoute(ORDERS_ROUTE);

        close();
      })
      .catch((e) => console.log(e.response.data.message));
  };

  const navigateToRoute = (route: string) => {
    dispatch(appSlice.actions.setActiveRoute(route));
    navigate(route);
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
          src={loginModal.user?.avatar ? loginModal.user.avatar : defaultAvatar}
        />
        <div className={styles.user_name}>{loginModal.user?.name}</div>
        <Textbox
          label="Пароль"
          value={password}
          isPassword
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className={styles.login_button}
          variant={ButtonVariants.primary}
          onClick={signIn}
        >
          Войти
        </Button>
      </div>
    </Modal>
  );
};

export default LoginModal;
