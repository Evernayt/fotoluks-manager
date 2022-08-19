import { Button, SelectButton, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { SHOP_KEY } from 'constants/localStorage';
import { ORDERS_ROUTE } from 'constants/paths';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchShopsAPI } from 'http/shopAPI';
import { loginAPI } from 'http/userAPI';
import { IShop } from 'models/IShop';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appSlice } from 'store/reducers/AppSlice';
import { userSlice } from 'store/reducers/UserSlice';
import styles from './LoginPage.module.css';
import socketio from 'socket/socketio';
import { UserRoles } from 'models/IUser';

const LoginPage = () => {
  const [shops, setShops] = useState<IShop[]>([]);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const activeShop = useAppSelector((state) => state.app.activeShop);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const shop = JSON.parse(localStorage.getItem(SHOP_KEY) || '{}');
    if (Object.keys(shop).length !== 0) {
      dispatch(appSlice.actions.setActiveShop(shop));
    }

    fetchShops();
  }, []);

  const fetchShops = () => {
    fetchShopsAPI().then((data) => {
      setShops(data);
    });
  };

  const selectShop = (e: IShop) => {
    dispatch(appSlice.actions.setActiveShop(e));
    localStorage.setItem(SHOP_KEY, JSON.stringify(e));
  };

  const signIn = () => {
    if (login === '' && password === '') return;
    loginAPI(login, password)
      .then((data) => {
        if (data.role === UserRoles.USER) {
          console.log('Нет доступа');
          return;
        }

        socketio.connect(data);
        dispatch(userSlice.actions.signIn(data));
        navigate(ORDERS_ROUTE);
      })
      .catch((e) => console.log(e.response.data.message));
  };

  // const socketStart = (user: IUser) => {
  //   const socket = io(SERVER_API_URL);
  //   dispatch(appSlice.actions.setSocket(socket));

  //   socket.emit('addUser', user);

  //   socket.on('getNotification', (title, text) => {
  //     window.electron.ipcRenderer.sendMessage('show-notification', [
  //       title,
  //       text,
  //     ]);
  //   });
  // };

  return (
    <div className={styles.container}>
      <div className={styles.main_section}>
        <div className={styles.left_section}>
          {/* <img className={styles.logo} src={logo} alt="logo" /> */}
          <h1>Добро пожаловать!</h1>
        </div>
        <div>
          <div className={styles.form_container}>
            <Textbox
              label="Логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <Textbox
              label="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isPassword
            />
            <Button
              variant={ButtonVariants.primary}
              style={{ fontSize: '16px', fontWeight: 'bold', height: '42px' }}
              disabled={login === '' || password === '' || activeShop.id === 0}
              onClick={signIn}
            >
              Войти
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <SelectButton
          items={shops}
          defaultSelectedItem={activeShop}
          changeHandler={selectShop}
          placement={Placements.topEnd}
        />
      </div>
    </div>
  );
};

export default LoginPage;
