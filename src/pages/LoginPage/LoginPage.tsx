import { Button, SelectButton, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { RECENT_LOGINS_KEY, SHOP_KEY } from 'constants/localStorage';
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
import { IUser, UserRoles } from 'models/IUser';
import { logo } from 'constants/images';
import RecentLogin from './RecentLogin/RecentLogin';
import LoginModal from './Modals/LoginModal/LoginModal';

const LoginPage = () => {
  const [shops, setShops] = useState<IShop[]>([]);
  const [recentLogins, setRecentLogins] = useState<IUser[]>([]);
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

    const localRecentLogins: IUser[] = JSON.parse(
      localStorage.getItem(RECENT_LOGINS_KEY) || '[]'
    );
    setRecentLogins(localRecentLogins);
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
    loginAPI(login, password)
      .then((data) => {
        if (data.role === UserRoles.USER) {
          console.log('Нет доступа');
          return;
        }

        socketio.connect(data);
        dispatch(userSlice.actions.signIn(data));
        navigate(ORDERS_ROUTE);

        addRecentLogin(data);
      })
      .catch((e) => console.log(e.response.data.message));
  };

  const addRecentLogin = (user: IUser) => {
    const localRecentLogins: IUser[] = JSON.parse(
      localStorage.getItem(RECENT_LOGINS_KEY) || '[]'
    );

    for (let i = 0; i < localRecentLogins.length; i++) {
      if (localRecentLogins[i].id === user.id) {
        return;
      }
    }

    if (localRecentLogins.length === 2) {
      localRecentLogins.shift();
    }

    localRecentLogins.push(user);
    localStorage.setItem(RECENT_LOGINS_KEY, JSON.stringify(localRecentLogins));
  };

  const removeRecentLogin = (userId: number) => {
    const changedRecentLogins = recentLogins.filter(
      (state) => state.id !== userId
    );
    setRecentLogins(changedRecentLogins);
    localStorage.setItem(
      RECENT_LOGINS_KEY,
      JSON.stringify(changedRecentLogins)
    );
  };

  return (
    <div className={styles.container}>
      <LoginModal />
      <div className={styles.main_section}>
        <div>
          <img className={styles.logo} src={logo} alt="logo" />
          {recentLogins.length > 0 ? (
            <>
              <div className={styles.title}>Недавние входы</div>
              <div className={styles.text}>
                Нажмите на изображение чтобы войти.
              </div>
              <div className={styles.recent_logins}>
                {recentLogins.map((recentLogin) => (
                  <RecentLogin
                    user={recentLogin}
                    removeRecentLogin={removeRecentLogin}
                    key={recentLogin.id}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className={styles.title}>Добро пожаловать!</div>
          )}
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
