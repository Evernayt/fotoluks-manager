import { IconButton } from 'components';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import { defaultAvatar } from 'constants/images';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconClose } from 'icons';
import { IEmployee } from 'models/api/IEmployee';
import { GlobalMessageVariants } from 'models/IGlobalMessage';
import { FC, memo } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './RecentLogin.module.scss';

interface RecentLoginProps {
  employee: IEmployee;
  removeRecentLogin: (userId: number) => void;
}

const RecentLogin: FC<RecentLoginProps> = memo(
  ({ employee, removeRecentLogin }) => {
    const activeShop = useAppSelector((state) => state.app.activeShop);

    const dispatch = useAppDispatch();

    const openLoginModal = () => {
      if (activeShop.id === 0) {
        showGlobalMessage('Филиал не выбран', GlobalMessageVariants.warning);
        return;
      }
      dispatch(
        modalSlice.actions.openModal({
          modal: 'loginModal',
          props: { employee },
        })
      );
    };

    return (
      <div className={styles.container}>
        <IconButton
          className={styles.close_button}
          icon={<IconClose className="secondary-icon" size={14} />}
          circle
          style={{ width: '18px', maxHeight: '18px', minHeight: '18px' }}
          onClick={() => removeRecentLogin(employee.id)}
        />
        <div onClick={openLoginModal}>
          <img
            className={styles.avatar}
            src={employee.avatar ? employee.avatar : defaultAvatar}
            alt=""
          />
          <div className={styles.user_name}>{employee.name}</div>
        </div>
      </div>
    );
  }
);

export default RecentLogin;
