import styles from './Navmenu.module.css';
import { IconControlPanel, IconOrders } from 'icons';
import logoBird from '../../../assets/logo-bird.png';
import {
  CONTROL_PANEL_ROUTE,
  ORDERS_ROUTE,
  PROFILE_ROUTE,
} from 'constants/paths';
import { useNavigate } from 'react-router-dom';
import { FC, ReactNode, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import Tooltip from 'components/UI/Tooltip/Tooltip';
import { defaultAvatar } from 'constants/images';
import { UserRoles } from 'models/IUser';
import { appSlice } from 'store/reducers/AppSlice';
import NotificationButton from './NotificationButton/NotificationButton';
import MenuButton from './MenuButton/MenuButton';

interface INavmenu {
  searchRender?: () => ReactNode;
}

const Navmenu: FC<INavmenu> = ({ searchRender = () => null }) => {
  const activeRoute = useAppSelector((state) => state.app.activeRoute);
  const user = useAppSelector((state) => state.user.user);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const navigateToRoute = (route: string) => {
    dispatch(appSlice.actions.setActiveRoute(route));
    navigate(route);
  };

  const pages = useMemo(
    () => [
      {
        id: 'orders_navmenu',
        route: ORDERS_ROUTE,
        Icon: IconOrders,
        name: 'Заказы',
        access: UserRoles.EMPLOYEE,
      },
      {
        id: 'control_panel_navmenu',
        route: CONTROL_PANEL_ROUTE,
        Icon: IconControlPanel,
        name: 'Панель управления',
        access: UserRoles.ADMIN,
      },
    ],
    []
  );

  return (
    <div className={styles.container}>
      <div className={styles.left_section}>
        <img className={styles.logo} src={logoBird} alt="logo" />
        {searchRender()}
      </div>
      <div className={styles.center_section}>
        {pages.map((page) => {
          if (
            page.access === UserRoles.ADMIN &&
            user?.role !== UserRoles.ADMIN
          ) {
            return null;
          } else {
            const { Icon } = page;
            return (
              <Tooltip label={page.name} placement="bottom" key={page.id}>
                <div>
                  <input
                    id={page.id}
                    name="navmenu"
                    type="radio"
                    checked={activeRoute === page.route}
                    onChange={() => navigateToRoute(page.route)}
                  />
                  <label className={styles.center_rbtn} htmlFor={page.id}>
                    <Icon
                      className={
                        activeRoute === page.route
                          ? 'link-checked-icon'
                          : 'link-icon'
                      }
                    />
                    <div className={styles.center_rbtn_line} />
                  </label>
                </div>
              </Tooltip>
            );
          }
        })}
      </div>
      <div className={styles.right_section}>
        <input
          id="profile_navmenu"
          name="navmenu"
          type="radio"
          checked={activeRoute === PROFILE_ROUTE}
          onChange={() => navigateToRoute(PROFILE_ROUTE)}
        />
        <label className={styles.profile_rbtn} htmlFor="profile_navmenu">
          <img
            className={styles.profile_avatar}
            src={user?.avatar ? user.avatar : defaultAvatar}
            alt=""
          />
          <span>{user?.name}</span>
        </label>
        <NotificationButton />
        <MenuButton />
      </div>
    </div>
  );
};

export default Navmenu;
