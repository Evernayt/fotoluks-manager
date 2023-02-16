import { Button, SelectButton, Textbox, Updater } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { INITIAL_SETTINGS_ROUTE } from 'constants/paths';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IShop } from 'models/api/IShop';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appSlice } from 'store/reducers/AppSlice';
import socketio from 'socket/socketio';
import { logo, logoDark } from 'constants/images';
import RecentLogin from './RecentLogin/RecentLogin';
import LoginModal from './Modals/LoginModal/LoginModal';
import { GlobalMessageVariants } from 'models/IGlobalMessage';
import { enterPressHandler, getApps } from 'helpers';
import ShopAPI from 'api/ShopAPI/ShopAPI';
import AuthAPI from 'api/AuthAPI/AuthAPI';
import { employeeSlice } from 'store/reducers/EmployeeSlice';
import { IEmployee } from 'models/api/IEmployee';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { moyskladSlice } from 'store/reducers/MoyskladSlice';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import styles from './LoginPage.module.scss';
import {
  getActiveShop,
  getInitialSettingsCompleted,
  getMaximizeScreen,
  getRecentLogins,
  setActiveShop,
  setRecentLogins,
} from 'helpers/localStorage';

const LoginPage = () => {
  const [recentEmployees, setRecentEmployees] = useState<IEmployee[]>([]);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const shops = useAppSelector((state) => state.app.shops);
  const activeShop = useAppSelector((state) => state.app.activeShop);
  const theme = useAppSelector((state) => state.app.theme);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!getInitialSettingsCompleted()) {
      navigate(INITIAL_SETTINGS_ROUTE);
      return;
    }

    if (getMaximizeScreen()) {
      window.electron.ipcRenderer.sendMessage('maximize', []);
    }

    const shop = getActiveShop();
    if (shop) {
      dispatch(appSlice.actions.setActiveShop(shop));
    }

    setRecentEmployees(getRecentLogins());

    const controller = new AbortController();
    fetchShops(controller.signal);
    return () => controller.abort();
  }, []);

  const fetchShops = (signal?: AbortSignal) => {
    ShopAPI.getAll({}, signal)
      .then((data) => {
        dispatch(appSlice.actions.setShops(data.rows));
      })
      .catch((e) =>
        showGlobalMessage(e.response.data ? e.response.data.message : e.message)
      );
  };

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

  const shopChangeHandler = (shop: IShop) => {
    dispatch(appSlice.actions.setActiveShop(shop));
    setActiveShop(shop);
  };

  const signIn = () => {
    if (activeShop.id === 0) {
      showGlobalMessage('Выберите филиал', GlobalMessageVariants.warning);
      return;
    }

    setIsLoading(true);
    AuthAPI.login({ login, password })
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
        addRecentLogin(data);
      })
      .catch((e) => {
        showGlobalMessage(
          e.response.data ? e.response.data.message : e.message
        );
      })
      .finally(() => setIsLoading(false));
  };

  const addRecentLogin = (employee: IEmployee) => {
    const recentLogins = getRecentLogins();

    for (let i = 0; i < recentLogins.length; i++) {
      if (recentLogins[i].id === employee.id) {
        return;
      }
    }

    if (recentLogins.length === 2) {
      recentLogins.shift();
    }

    recentLogins.push(employee);
    setRecentLogins(recentLogins);
  };

  const removeRecentLogin = (employeeId: number) => {
    const recentLogins = recentEmployees.filter(
      (state) => state.id !== employeeId
    );
    setRecentEmployees(recentLogins);
    setRecentLogins(recentLogins);
  };

  const onEnterPress = (event: KeyboardEvent) => {
    if (login !== '' && password !== '' && activeShop.id !== 0) {
      enterPressHandler(event, signIn);
    }
  };

  return (
    <div className={styles.container}>
      <LoginModal />
      <div className={styles.header}>
        <Updater />
      </div>
      <div className={styles.main_section}>
        <div>
          <img
            className={styles.logo}
            src={theme.value === 'DARK' ? logoDark : logo}
            alt="logo"
          />
          {recentEmployees.length > 0 ? (
            <>
              <div className={styles.title}>Недавние входы</div>
              <div className={styles.text}>
                Нажмите на изображение чтобы войти.
              </div>
              <div className={styles.recent_logins}>
                {recentEmployees.map((recentEmployee) => (
                  <RecentLogin
                    employee={recentEmployee}
                    removeRecentLogin={removeRecentLogin}
                    key={recentEmployee.id}
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
              className={styles.login_btn}
              disabled={login === '' || password === ''}
              isLoading={isLoading}
              loadingText="Авторизация..."
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
          onChange={shopChangeHandler}
          placement={Placements.topEnd}
        />
      </div>
    </div>
  );
};

export default LoginPage;
