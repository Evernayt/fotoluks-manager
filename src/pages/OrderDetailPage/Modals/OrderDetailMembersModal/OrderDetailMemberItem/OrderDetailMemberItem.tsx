import { IconButton } from 'components';
import { defaultAvatar } from 'constants/images';
import { minusIcon, plusIcon } from 'icons';
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
        icon={isAdded ? minusIcon : plusIcon}
        style={{ minHeight: '32px', padding: '4px' }}
        onClick={clickHandler}
      ></IconButton>
    </div>
  );
};

export default OrderDetailMemberItem;
