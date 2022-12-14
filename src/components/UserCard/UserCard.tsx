import { Button, CircleButton, Tooltip } from 'components';
import { defaultAvatar, email, telegram, vk } from 'constants/images';
import { useAppDispatch } from 'hooks/redux';
import { IconClose } from 'icons';
import { IUser } from 'models/IUser';
import { mask } from 'node-masker';
import { FC, useState } from 'react';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './UserCard.module.css';

interface UserCardProps {
  user: IUser;
  isEditable?: boolean;
  close: () => void;
}

const UserCard: FC<UserCardProps> = ({ user, isEditable = false, close }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const copyHandler = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 500);
    });
  };

  const openEditUserModal = () => {
    dispatch(modalSlice.actions.openEditUserModal(user.phone!));
  };

  return (
    <div className={styles.container}>
      <div className={styles.top_section}>
        <div className={styles.user_container}>
          <img
            className={styles.user_avatar}
            src={user.avatar ? user.avatar : defaultAvatar}
            alt=""
          />
          <div className={styles.user_info}>
            <span className={styles.user_name}>{user.name}</span>
            <span className={styles.user_phone}>
              {user.phone
                ? mask(user.phone, '8 (999) 999-99-99')
                : 'Не указано'}
            </span>
            <div className={styles.user_social}>
              {user.email && (
                <Tooltip label="Скопировано" disabled={!isCopied} delay={0}>
                  <img
                    className={styles.social_img}
                    src={email}
                    onClick={() => copyHandler(user.email!)}
                  />
                </Tooltip>
              )}
              {user.vk && (
                <Tooltip label="Скопировано" disabled={!isCopied} delay={0}>
                  <img
                    className={styles.social_img}
                    src={vk}
                    onClick={() => copyHandler(user.vk!)}
                  />
                </Tooltip>
              )}
              {user.telegram && (
                <Tooltip label="Скопировано" disabled={!isCopied} delay={0}>
                  <img
                    className={styles.social_img}
                    src={telegram}
                    onClick={() => copyHandler(user.telegram!)}
                  />
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        <CircleButton
          icon={<IconClose className="secondary-icon" size={14} />}
          style={{ width: '18px', height: '18px' }}
          onClick={close}
        />
      </div>
      {isEditable && <Button onClick={openEditUserModal}>Редактировать</Button>}
    </div>
  );
};

export default UserCard;
