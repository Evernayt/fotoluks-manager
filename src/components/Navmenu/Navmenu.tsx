import logoBird from '../../../assets/logo-bird.png';
import { PROFILE_ROUTE } from 'constants/paths';
import { useLocation, useNavigate } from 'react-router-dom';
import { FC, ReactNode, useMemo } from 'react';
import { useAppSelector } from 'hooks/redux';
import Tooltip from 'components/UI/Tooltip/Tooltip';
import { defaultAvatar } from 'constants/images';
import NotificationButton from './NotificationButton/NotificationButton';
import MenuButton from './MenuButton/MenuButton';
import styles from './Navmenu.module.scss';
import { getApps } from 'helpers';
import Updater from 'components/Updater/Updater';

interface INavmenuProps {
  searchRender?: () => ReactNode;
}

const Navmenu: FC<INavmenuProps> = ({ searchRender = () => null }) => {
  const employee = useAppSelector((state) => state.employee.employee);

  const location = useLocation();

  const navigate = useNavigate();

  const employeeApps = useMemo(() => getApps(employee?.apps), [employee?.apps]);

  return (
    <div className={styles.container}>
      <div className={styles.left_section}>
        <img className={styles.logo} src={logoBird} alt="logo" />
        {searchRender()}
      </div>
      <div className={styles.center_section}>
        {employeeApps.map((app) => {
          const { Icon } = app;
          return (
            <Tooltip label={app.description} placement="bottom" key={app.value}>
              <div>
                <input
                  id={app.value}
                  name="navmenu"
                  type="radio"
                  checked={location.pathname === app.route}
                  onChange={() => navigate(app.route)}
                />
                <label className={styles.center_rbtn} htmlFor={app.value}>
                  <Icon
                    className={
                      location.pathname === app.route
                        ? 'link-checked-icon'
                        : 'link-icon'
                    }
                  />
                  <div className={styles.center_rbtn_line} />
                </label>
              </div>
            </Tooltip>
          );
        })}
      </div>
      <div className={styles.right_section}>
        <input
          id="profile_navmenu"
          name="navmenu"
          type="radio"
          checked={location.pathname === PROFILE_ROUTE}
          onChange={() => navigate(PROFILE_ROUTE)}
        />
        <label className={styles.profile_rbtn} htmlFor="profile_navmenu">
          <img
            className={styles.profile_avatar}
            src={employee?.avatar || defaultAvatar}
            alt=""
          />
          <span>{employee?.name}</span>
        </label>
        <Updater />
        <NotificationButton />
        <MenuButton />
      </div>
    </div>
  );
};

export default Navmenu;
