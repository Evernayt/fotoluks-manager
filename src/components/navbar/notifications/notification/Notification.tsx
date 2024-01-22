import { APPS, ICON_SIZE, ICON_STROKE, UI_DATE_FORMAT } from 'constants/app';
import { INotification } from 'models/api/INotification';
import { FC } from 'react';
import { Divider, Text } from '@chakra-ui/react';
import moment from 'moment';
import styles from './Notification.module.scss';

interface NotificationProps {
  notification: INotification;
}

const Notification: FC<NotificationProps> = ({ notification }) => {
  const Icon =
    APPS.find((x) => x.id === notification.appId)?.Icon || APPS[0].Icon;

  return (
    <div className={styles.conatiner}>
      <div className={styles.icon}>
        <Icon className="link-icon" size={ICON_SIZE} stroke={ICON_STROKE} />
      </div>
      <div>
        <Divider className={styles.separator} orientation="vertical" />
      </div>
      <div className={styles.notification}>
        <div className={styles.title_container}>
          <Text className={styles.title}>{notification.title}</Text>
          <Text className={styles.created_date}>
            {moment(notification.createdAt).format(UI_DATE_FORMAT)}
          </Text>
        </div>
        <Text>{notification.text}</Text>
      </div>
    </div>
  );
};

export default Notification;
