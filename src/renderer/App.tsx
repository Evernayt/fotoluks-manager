import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import {
  CONTROL_ROUTE,
  LOGIN_ROUTE,
  MOYSKLAD_ROUTE,
  ORDERS_ROUTE,
  ORDER_DETAIL_ROUTE,
  TASK_DETAIL_ROUTE,
  TASKS_ROUTE,
  PROFILE_ROUTE,
  SETTINGS_ROUTE,
  MOVES_DETAIL_ROUTE,
} from 'constants/paths';
import { LoginPage, OrdersPage, TasksPage } from 'pages';
import WithNavbar from './WithNavbar';
import { Suspense, lazy, useLayoutEffect } from 'react';
import { getMaximizeScreen } from 'helpers/localStorage';
import {
  AppCloseModal,
  Loader,
  ReportModal,
  UpdaterListener,
} from 'components';
import './App.css';

const OrderDetailPage = lazy(
  () => import('../pages/order-detail-page/OrderDetailPage')
);
const TaskDetailPage = lazy(
  () => import('../pages/task-detail-page/TaskDetailPage')
);
const MovesDetailPage = lazy(
  () => import('../pages/moysklad-detail-pages/moves/MovesDetailPage')
);
const MoyskladPage = lazy(() => import('../pages/moysklad-page/MoyskladPage'));
const ControlPage = lazy(() => import('../pages/control-page/ControlPage'));
const ProfilePage = lazy(() => import('../pages/profile-page/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/settings-page/SettingsPage'));

export default function App() {
  useLayoutEffect(() => {
    if (getMaximizeScreen()) {
      window.electron.ipcRenderer.sendMessage('maximize', []);
    }
  }, []);

  return (
    <>
      <UpdaterListener />
      <Router>
        <ReportModal />
        <AppCloseModal />
        <Suspense fallback={<Loader minHeight="100vh" />}>
          <Routes>
            <Route path={LOGIN_ROUTE} element={<LoginPage />} />
            <Route path={ORDER_DETAIL_ROUTE} element={<OrderDetailPage />} />
            <Route path={TASK_DETAIL_ROUTE} element={<TaskDetailPage />} />
            <Route path={MOVES_DETAIL_ROUTE} element={<MovesDetailPage />} />
            <Route element={<WithNavbar />}>
              <Route path={ORDERS_ROUTE} element={<OrdersPage />} />
              <Route path={TASKS_ROUTE} element={<TasksPage />} />
              <Route path={MOYSKLAD_ROUTE} element={<MoyskladPage />} />
              <Route path={CONTROL_ROUTE} element={<ControlPage />} />
              <Route path={PROFILE_ROUTE} element={<ProfilePage />} />
              <Route path={SETTINGS_ROUTE} element={<SettingsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}
