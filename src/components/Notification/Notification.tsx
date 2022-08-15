import { getDateDiff } from 'helpers';
import { FC } from 'react';
import styles from './Notification.module.css';

interface NotificationProps {
  title: string;
  text: string;
  createdAt: string;
}

const Notification: FC<NotificationProps> = ({ title, text, createdAt }) => {
  return (
    <div className={styles.conatiner}>
      <div className={styles.title}>{title}</div>
      <div className={styles.text}>{text}</div>
      <div className={styles.createdAt}>{getDateDiff(createdAt)}</div>
    </div>
  );
};

export default Notification;
