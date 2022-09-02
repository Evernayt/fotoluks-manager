import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import {
  CONTROL_PANEL_ROUTE,
  INITIAL_SETTINGS_ROUTE,
  LOGIN_ROUTE,
  ORDERS_ROUTE,
  ORDER_DETAIL_ROUTE,
  PROFILE_ROUTE,
} from 'constants/paths';
import {
  ControlPanelPage,
  InitialSettingsPage,
  LoginPage,
  OrderDetailPage,
  OrdersPage,
  ProfilePage,
} from 'pages';
import { GlobalMessage } from 'components';
import './App.css';

export default function App() {
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
      </Routes>
    </Router>
  );
}
