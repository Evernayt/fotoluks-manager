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
import {
  deleteAllNotificationsAPI,
  fetchNotificationsAPI,
} from 'http/notificationAPI';
import { IconClearAll, IconNotification } from 'icons';
import { useEffect, useRef, useState } from 'react';
import { appSlice } from 'store/reducers/AppSlice';
import { userSlice } from 'store/reducers/UserSlice';
import styles from './NotificationButton.module.css';

const limit = 25;

const NotificationButton = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const notifications = useAppSelector((state) => state.user.notifications);
  const user = useAppSelector((state) => state.user.user);
  const notificationsBadge = useAppSelector(
    (state) => state.app.notificationsBadge
  );

  const targetRef = useRef<HTMLDivElement>(null);

  const isVisible = useElementOnScreen({}, targetRef);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(userSlice.actions.clearNotifications());
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
          dispatch(userSlice.actions.addNotifications(data.rows));
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
            dispatch(userSlice.actions.clearNotifications());
            setPage(1);
            setPageCount(1);
          }
        })
        .finally(() => setLoading(false));
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
              <div className={styles.notifications_title}>??????????????????????</div>
              <Tooltip label="???????????????? ??????" placement="bottom">
                <div>
                  <IconButton
                    icon={<IconClearAll className="link-icon" />}
                    variant={IconButtonVariants.link}
                    onClick={deleteAllNotifications}
                  ></IconButton>
                </div>
              </Tooltip>
            </div>

            <div className={styles.notifications}>
              {notifications.length === 0 && (
                <div className={styles.no_notifications}>?????? ??????????????????????</div>
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
    </div>
  );
};

export default NotificationButton;
