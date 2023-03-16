import { APPS } from 'constants/app';
import { getDateDiff } from 'helpers';
import { INotification } from 'models/api/INotification';
import { FC } from 'react';
import styles from './Notification.module.scss';

interface NotificationProps {
  notification: INotification;
}

const Notification: FC<NotificationProps> = ({ notification }) => {
  const Icon =
    APPS.find((x) => x.value === notification.app?.value)?.Icon || APPS[0].Icon;

  return (
    <div className={styles.conatiner}>
      <div className={styles.icon}>
        <Icon className="link-icon" />
      </div>
      <div className={styles.separator} />
      <div className={styles.notification}>
        <div className={styles.title_container}>
          <div className={styles.title}>{notification.title}</div>
          <div className={styles.created_date}>
            {getDateDiff(notification.createdAt)}
          </div>
        </div>
        <div className={styles.text}>{notification.text}</div>
      </div>
    </div>
  );
};

export default Notification;
