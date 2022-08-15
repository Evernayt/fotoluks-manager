import Notification from 'components/Notification/Notification';
import DropdownButton from 'components/UI/DropdownButton/DropdownButton';
import IconButton, {
  IconButtonVariants,
} from 'components/UI/IconButton/IconButton';
import Tooltip from 'components/UI/Tooltip/Tooltip';
import { Placements } from 'helpers/calcPlacement';
import { useAppSelector } from 'hooks/redux';
import {
  deleteAllNotificationsAPI,
  fetchNotificationsAPI,
} from 'http/notificationAPI';
import { clearAllIcon, notificationIcon } from 'icons';
import { INotification } from 'models/INotification';
import { useEffect, useState } from 'react';
import styles from './NotificationButton.module.css';

const NotificationButton = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    fetchUserNotifications();
  }, []);

  const fetchUserNotifications = () => {
    if (user) {
      fetchNotificationsAPI(25, 1, user.id).then((data) => {
        setNotifications(data.rows);
      });
    }
  };

  const deleteAllNotifications = () => {
    if (user) {
      deleteAllNotificationsAPI(user.id).then((data) => {
        if (data.message === 'DELETED') {
          setNotifications([]);
        }
      });
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
            <Tooltip label="Очистить все" placement="bottom">
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
          </div>
        </div>
      )}
    />
  );
};

export default NotificationButton;
