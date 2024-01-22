import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useAppSelector } from 'hooks/redux';
import { logoSmall } from 'constants/images';
import { IconButton, Tooltip } from '@chakra-ui/react';
import NavbarMenu from './NavbarMenu';
import NavbarNotifications from './notifications/NavbarNotifications';
import { getEmployeeApps } from 'helpers/employee';
import Updater from 'components/updater/Updater';
import styles from './Navbar.module.scss';

const Navbar = () => {
  const employee = useAppSelector((state) => state.employee.employee);

  const employeeApps = useMemo(
    () => getEmployeeApps(employee?.apps),
    [employee?.apps]
  );

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.left_section}>
        <img className={styles.logo} src={logoSmall} alt="logo" />
      </div>
      <div className={styles.center_section}>
        {employeeApps.map((app) => {
          const isSelected = location.pathname === app.route;
          const { Icon } = app;
          return (
            <Tooltip label={app.description} key={app.value}>
              <div>
                <IconButton
                  icon={
                    <Icon
                      className={isSelected ? 'link-checked-icon' : 'link-icon'}
                    />
                  }
                  aria-label={app.value}
                  variant="ghost"
                  isDisabled={isSelected}
                  h="48px"
                  w="110px"
                  _disabled={{ cursor: 'default' }}
                  onClick={() => navigate(app.route)}
                />
                <div
                  className={styles.line}
                  style={{ height: isSelected ? '3px' : '0' }}
                />
              </div>
            </Tooltip>
          );
        })}
      </div>
      <div className={styles.right_section}>
        <Updater />
        <NavbarNotifications />
        <NavbarMenu />
      </div>
    </div>
  );
};

export default Navbar;
