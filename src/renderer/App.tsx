import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import {
  CONTROL_PANEL_ROUTE,
  INITIAL_SETTINGS_ROUTE,
  LOGIN_ROUTE,
  ORDERS_ROUTE,
  ORDER_DETAIL_ROUTE,
  PROFILE_ROUTE,
  SETTINGS_ROUTE,
} from 'constants/paths';
import {
  ControlPanelPage,
  InitialSettingsPage,
  LoginPage,
  OrderDetailPage,
  OrdersPage,
  ProfilePage,
  SettingsPage,
} from 'pages';
import { GlobalMessage } from 'components';
import './App.css';
import { useLayoutEffect } from 'react';
import { useAppSelector } from 'hooks/redux';
import { THEME_KEY } from 'constants/localStorage';

export default function App() {
  const theme = useAppSelector((state) => state.app.theme);

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.value);
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
  }, [theme]);

  return (
    <Router>
      <GlobalMessage />
      <Routes>
        <Route path={LOGIN_ROUTE} element={<LoginPage />} />
        <Route path={ORDERS_ROUTE} element={<OrdersPage />} />
        <Route path={ORDER_DETAIL_ROUTE} element={<OrderDetailPage />} />
        <Route path={CONTROL_PANEL_ROUTE} element={<ControlPanelPage />} />
        <Route path={PROFILE_ROUTE} element={<ProfilePage />} />
        <Route
          path={INITIAL_SETTINGS_ROUTE}
          element={<InitialSettingsPage />}
        />
        <Route path={SETTINGS_ROUTE} element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}
