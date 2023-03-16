import NotificationAPI from 'api/NotificationAPI/NotificationAPI';
import Loader from 'components/Loader/Loader';
import Notification from 'components/Notification/Notification';
import DropdownButton from 'components/UI/DropdownButton/DropdownButton';
import IconButton, {
  IconButtonVariants,
} from 'components/UI/IconButton/IconButton';
import Tooltip from 'components/UI/Tooltip/Tooltip';
import { Placements } from 'helpers/calcPlacement';
import { useElementOnScreen } from 'hooks';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconClearAll, IconNotification } from 'icons';
import { useEffect, useRef, useState } from 'react';
import { appSlice } from 'store/reducers/AppSlice';
import { employeeSlice } from 'store/reducers/EmployeeSlice';
import styles from './NotificationButton.module.scss';

const NotificationButton = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const notifications = useAppSelector((state) => state.employee.notifications);
  const employee = useAppSelector((state) => state.employee.employee);
  const notificationsBadge = useAppSelector(
    (state) => state.app.notificationsBadge
  );

  const targetRef = useRef<HTMLDivElement>(null);

  const isVisible = useElementOnScreen({}, targetRef);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(employeeSlice.actions.clearNotifications());
    fetchNotifications(page);
  }, []);

  useEffect(() => {
    if (isLoading || !isVisible) return;

    setIsLoading(true);
    setPage((prevState) => prevState + 1);
    fetchNotifications(page + 1);
  }, [isVisible]);

  const fetchNotifications = (page: number) => {
    if (employee) {
      const limit = 25;

      NotificationAPI.getAll({
        limit,
        page,
        employeeId: employee.id,
      })
        .then((data) => {
          dispatch(employeeSlice.actions.addNotifications(data.rows));
          const count = Math.ceil(data.count / limit);
          setPageCount(count);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const deleteAllNotifications = () => {
    if (employee) {
      setIsLoading(true);
      NotificationAPI.deleteByEmployeeId(employee.id)
        .then(() => {
          dispatch(employeeSlice.actions.clearNotifications());
          setPage(1);
          setPageCount(1);
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className={styles.container}>
      {notificationsBadge && <div className={styles.badge} />}
      <DropdownButton
        placement={Placements.bottomEnd}
        icon={<IconNotification className="secondary-icon" size={20} />}
        circle
        menuToggleCb={() =>
          dispatch(appSlice.actions.setNoificationsBadge(false))
        }
        itemRender={() => (
          <div>
            <div className={styles.notifications_header}>
              <div className={styles.notifications_title}>Уведомления</div>
              <Tooltip label="Очистить всё" placement="bottom">
                <div>
                  <IconButton
                    icon={<IconClearAll className="link-icon" />}
                    variant={IconButtonVariants.link}
                    onClick={deleteAllNotifications}
                  />
                </div>
              </Tooltip>
            </div>

            <div className={styles.notifications}>
              {isLoading ? (
                <div className={styles.loader_container}>
                  <Loader height="50px" width="50px" />
                </div>
              ) : (
                <>
                  {!notifications.length && (
                    <div className={styles.no_notifications}>
                      Нет уведомлений
                    </div>
                  )}
                  {notifications.map((notification) => (
                    <Notification
                      notification={notification}
                      key={notification.id}
                    />
                  ))}
                </>
              )}
              {page !== pageCount && <div ref={targetRef} />}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default NotificationButton;
