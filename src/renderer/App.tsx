import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import {
  CONTROL_PANEL_ROUTE,
  INITIAL_SETTINGS_ROUTE,
  LOGIN_ROUTE,
  MOVES_DETAIL_ROUTE,
  MOYSKLAD_ROUTE,
  ORDERS_ROUTE,
  ORDER_DETAIL_ROUTE,
  PROFILE_ROUTE,
  SETTINGS_ROUTE,
  TASKS_DETAIL_ROUTE,
  TASKS_ROUTE,
} from 'constants/paths';
import {
  ControlPanelPage,
  InitialSettingsPage,
  LoginPage,
  MoyskladPage,
  OrderDetailPage,
  OrdersPage,
  ProfilePage,
  SettingsPage,
  TasksDetailPage,
  TasksPage,
} from 'pages';
import { AppCloseModal, GlobalMessage, UpdaterModal } from 'components';
import './App.css';
import { useLayoutEffect } from 'react';
import { useAppSelector } from 'hooks/redux';
import { setTheme } from 'helpers/localStorage';
import { MoyskladMovesDetailPage } from 'pages/MoyskladPage/DetailPages';

export default function App() {
  const theme = useAppSelector((state) => state.app.theme);

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.value);
    setTheme(theme);
  }, [theme]);

  return (
    <Router>
      <UpdaterModal />
      <AppCloseModal />
      <GlobalMessage />
      <Routes>
        <Route path={LOGIN_ROUTE} element={<LoginPage />} />
        <Route path={ORDERS_ROUTE} element={<OrdersPage />} />
        <Route path={ORDER_DETAIL_ROUTE} element={<OrderDetailPage />} />
        <Route path={PROFILE_ROUTE} element={<ProfilePage />} />
        <Route path={MOYSKLAD_ROUTE} element={<MoyskladPage />} />
        <Route
          path={MOVES_DETAIL_ROUTE}
          element={<MoyskladMovesDetailPage />}
        />
        <Route path={CONTROL_PANEL_ROUTE} element={<ControlPanelPage />} />
        <Route
          path={INITIAL_SETTINGS_ROUTE}
          element={<InitialSettingsPage />}
        />
        <Route path={SETTINGS_ROUTE} element={<SettingsPage />} />
        <Route path={TASKS_ROUTE} element={<TasksPage />} />
        <Route path={TASKS_DETAIL_ROUTE} element={<TasksDetailPage />} />
      </Routes>
    </Router>
  );
}
