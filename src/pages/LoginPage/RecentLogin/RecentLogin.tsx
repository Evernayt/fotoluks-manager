import { CircleButton } from 'components';
import { defaultAvatar } from 'constants/images';
import { useAppDispatch } from 'hooks/redux';
import { close2Icon } from 'icons';
import { IUser } from 'models/IUser';
import { FC, memo } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './RecentLogin.module.css';

interface RecentLoginProps {
  user: IUser;
  removeRecentLogin: (userId: number) => void;
}

const RecentLogin: FC<RecentLoginProps> = memo(
  ({ user, removeRecentLogin }) => {
    const dispatch = useAppDispatch();

    const openLoginModal = () => {
      dispatch(modalSlice.actions.openLoginModal(user));
    };

    return (
      <div className={styles.container}>
        <CircleButton
          className={styles.close_button}
          icon={close2Icon}
          iconStyle={{ width: '24px', height: '24px' }}
          onClick={() => removeRecentLogin(user.id)}
        />
        <div onClick={openLoginModal}>
          <img
            className={styles.avatar}
            src={user.avatar ? user.avatar : defaultAvatar}
            alt=""
          />
          <div className={styles.user_name}>{user.name}</div>
        </div>
      </div>
    );
  }
);

export default RecentLogin;
