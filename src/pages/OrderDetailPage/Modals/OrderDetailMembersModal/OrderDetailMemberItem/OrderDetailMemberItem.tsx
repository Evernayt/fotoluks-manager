import { IconButton } from 'components';
import { defaultAvatar } from 'constants/images';
import { IconMinus, IconPlus } from 'icons';
import { IUser } from 'models/IUser';
import { FC } from 'react';
import styles from './OrderDetailMemberItem.module.css';

interface OrderDetailMemberItemProps {
  user: IUser;
  isAdded: boolean;
  clickHandler: () => void;
}

const OrderDetailMemberItem: FC<OrderDetailMemberItemProps> = ({
  user,
  isAdded,
  clickHandler,
}) => {
  return (
    <div className={styles.container}>
      <img
        className={styles.avatar}
        src={user.avatar ? user.avatar : defaultAvatar}
      />
      {user.name}
      <IconButton
        className={styles.button}
        style={{
          minHeight: '32px',
          padding: '4px',
        }}
        icon={
          isAdded ? (
            <IconMinus className="secondary-icon" />
          ) : (
            <IconPlus className="secondary-icon" />
          )
        }
        onClick={clickHandler}
      />
    </div>
  );
};

export default OrderDetailMemberItem;
