import { defaultAvatar } from 'constants/images';
import { IWatcher } from 'models/IWatcher';
import { FC } from 'react';
import styles from './OrderDetailWatchers.module.scss';

interface OrderDetailWatchersProps {
  watchers: IWatcher[];
}

const OrderDetailWatchers: FC<OrderDetailWatchersProps> = ({ watchers }) => {
  return (
    <div className={styles.container}>
      {watchers.map((watcher) => (
        <div className={styles.watcher_item} key={watcher.employee.id}>
          <img
            className={styles.avatar}
            src={watcher.employee.avatar || defaultAvatar}
          />
          <div>{watcher.employee.name}</div>
        </div>
      ))}
    </div>
  );
};

export default OrderDetailWatchers;
