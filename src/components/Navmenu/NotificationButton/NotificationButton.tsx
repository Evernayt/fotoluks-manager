import Loader from 'components/Loader/Loader';
import Notification from 'components/Notification/Notification';
import DropdownButton from 'components/UI/DropdownButton/DropdownButton';
import IconButton, {
  IconButtonVariants,
} from 'components/UI/IconButton/IconButton';
import Tooltip from 'components/UI/Tooltip/Tooltip';
import { Placements } from 'helpers/calcPlacement';
import { useElementOnScreen } from 'hooks';
import { useAppSelector } from 'hooks/redux';
import {
  deleteAllNotificationsAPI,
  fetchNotificationsAPI,
} from 'http/notificationAPI';
import { clearAllIcon, notificationIcon } from 'icons';
import { INotification } from 'models/INotification';
import { useEffect, useRef, useState } from 'react';
import styles from './NotificationButton.module.css';

const limit = 25;

const NotificationButton = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const user = useAppSelector((state) => state.user.user);

  const targetRef = useRef<HTMLDivElement>(null);

  const isVisible = useElementOnScreen({}, targetRef);

  useEffect(() => {
    fetchUserNotifications(page);
  }, []);

  useEffect(() => {
    if (loading || !isVisible) return;

    setLoading(true);
    setPage((prevState) => prevState + 1);
    fetchUserNotifications(page + 1);
  }, [isVisible]);

  const fetchUserNotifications = (page: number) => {
    if (user) {
      fetchNotificationsAPI(limit, page, user.id)
        .then((data) => {
          setNotifications((prevState) => {
            return (prevState = [...prevState, ...data.rows]);
          });

          const count = Math.ceil(data.count / limit);
          setPageCount(count);
        })
        .finally(() => setLoading(false));
    }
  };

  const deleteAllNotifications = () => {
    if (user) {
      deleteAllNotificationsAPI(user.id)
        .then((data) => {
          if (data.message === 'DELETED') {
            setNotifications([]);
            setPage(1);
            setPageCount(1);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <DropdownButton
      placement={Placements.bottomEnd}
      icon={notificationIcon}
      circle
      itemRender={() => (
        <div>
          <div className={styles.notifications_header}>
            <div className={styles.notifications_title}>Уведомления</div>
            <Tooltip label="Очистить всё" placement="bottom">
              <div>
                <IconButton
                  icon={clearAllIcon}
                  variant={IconButtonVariants.link}
                  onClick={deleteAllNotifications}
                ></IconButton>
              </div>
            </Tooltip>
          </div>

          <div className={styles.notifications}>
            {notifications.length === 0 && (
              <div className={styles.no_notifications}>Нет уведомлений</div>
            )}
            {notifications.map((notification) => (
              <Notification
                title={notification.title}
                text={notification.text}
                createdAt={notification.createdAt}
                key={notification.id}
              />
            ))}
            {loading && (
              <div className={styles.loader_container}>
                <Loader height="50px" width="50px" />
              </div>
            )}

            {page !== pageCount && <div ref={targetRef} />}
          </div>
        </div>
      )}
    />
  );
};

export default NotificationButton;
