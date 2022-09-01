import { defaultAvatar } from 'constants/images';
import { IWatcher } from 'models/IWatcher';
import { FC } from 'react';
import styles from './OrderDetailWatchers.module.css';

interface OrderDetailWatchersProps {
  watchers: IWatcher[];
}

const OrderDetailWatchers: FC<OrderDetailWatchersProps> = ({ watchers }) => {
  return (
    <div className={styles.container}>
      {watchers.map((watcher) => (
        <div className={styles.watcher_item} key={watcher.user.id}>
          <img
            className={styles.avatar}
            src={watcher.user.avatar ? watcher.user.avatar : defaultAvatar}
          />
          <div>{watcher.user.name}</div>
        </div>
      ))}
    </div>
  );
};

export default OrderDetailWatchers;
