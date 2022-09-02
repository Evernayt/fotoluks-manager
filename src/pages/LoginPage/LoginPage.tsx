import { Button, SelectButton, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import {
  INITIAL_SETTINGS_COMPLETED_KEY,
  RECENT_LOGINS_KEY,
  SHOP_KEY,
} from 'constants/localStorage';
import { INITIAL_SETTINGS_ROUTE, ORDERS_ROUTE } from 'constants/paths';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchShopsAPI } from 'http/shopAPI';
import { loginAPI } from 'http/userAPI';
import { IShop } from 'models/IShop';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appSlice } from 'store/reducers/AppSlice';
import { userSlice } from 'store/reducers/UserSlice';
import styles from './LoginPage.module.css';
import socketio from 'socket/socketio';
import { IUser, UserRoles } from 'models/IUser';
import { logo } from 'constants/images';
import RecentLogin from './RecentLogin/RecentLogin';
import LoginModal from './Modals/LoginModal/LoginModal';
import { GlobalMessageVariants } from 'models/IGlobalMessage';
import { enterPressHandler } from 'helpers';

const LoginPage = () => {
  const [shops, setShops] = useState<IShop[]>([]);
  const [recentLogins, setRecentLogins] = useState<IUser[]>([]);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const activeShop = useAppSelector((state) => state.app.activeShop);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const initialSettingsCopmleted: boolean = Boolean(
      localStorage.getItem(INITIAL_SETTINGS_COMPLETED_KEY)
    );

    if (!initialSettingsCopmleted) {
      navigate(INITIAL_SETTINGS_ROUTE);
      return;
    }

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
          dispatch(
            appSlice.actions.showGlobalMessage({
              message: 'Нет доступа!',
              variant: GlobalMessageVariants.danger,
              isShowing: true,
            })
          );
          return;
        }

        socketio.connect(data);
        dispatch(userSlice.actions.signIn(data));
        navigateToRoute(ORDERS_ROUTE);

        addRecentLogin(data);
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

  const navigateToRoute = (route: string) => {
    dispatch(appSlice.actions.setActiveRoute(route));
    navigate(route);
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

  const onEnterPress = (event: KeyboardEvent) => {
    if (login !== '' && password !== '' && activeShop.id !== 0) {
      enterPressHandler(event, signIn);
    }
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
              onKeyUp={onEnterPress}
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
