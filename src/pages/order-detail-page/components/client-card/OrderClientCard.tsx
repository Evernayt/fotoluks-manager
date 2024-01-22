import { email, telegram, vk } from 'constants/images';
import { useAppDispatch } from 'hooks/redux';
import { IUser } from 'models/api/IUser';
import { mask } from 'node-masker';
import { FC } from 'react';
import { Avatar, Card, IconButton, Text } from '@chakra-ui/react';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { CopyWrapper } from 'components';
import { modalActions } from 'store/reducers/ModalSlice';
import { MODES } from 'constants/app';
import styles from './OrderClientCard.module.scss';

interface OrderClientCardProps {
  user: IUser;
  isEditable?: boolean;
  onClose?: () => void;
}

const OrderClientCard: FC<OrderClientCardProps> = ({
  user,
  isEditable = false,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const openClientEditModal = () => {
    dispatch(
      modalActions.openModal({
        modal: 'orderClientEditModal',
        props: { phone: user.phone, mode: MODES.EDIT_MODE },
      })
    );
  };

  const getUserName = () => {
    if (user.name || user.surname || user.patronymic) {
      return `${user.surname} ${user.name} ${user.patronymic}`;
    } else {
      return 'Неизвестный';
    }
  };

  return (
    <Card>
      <div className={styles.container}>
        <div className={styles.left_section}>
          <Avatar
            name={`${user.name} ${user.surname}`}
            src={user.avatar || undefined}
            size="md"
          />
          <div className={styles.user_info}>
            <Text>{getUserName()}</Text>
            <CopyWrapper text={user.phone}>
              <Text variant="secondary">
                {mask(user.phone, '8 (999) 999-99-99')}
              </Text>
            </CopyWrapper>
            <div className={styles.user_social}>
              {user.email && (
                <CopyWrapper text={user.email}>
                  <img className={styles.social_img} src={email} />
                </CopyWrapper>
              )}
              {user.vk && (
                <CopyWrapper text={user.vk}>
                  <img className={styles.social_img} src={vk} />
                </CopyWrapper>
              )}
              {user.telegram && (
                <CopyWrapper text={user.telegram}>
                  <img className={styles.social_img} src={telegram} />
                </CopyWrapper>
              )}
            </div>
          </div>
        </div>
        <div className={styles.right_section}>
          {onClose && (
            <IconButton
              icon={<IconTrash size={14} />}
              aria-label="close"
              isRound
              size="xs"
              onClick={onClose}
            />
          )}
          {isEditable && (
            <IconButton
              icon={<IconPencil size={14} />}
              aria-label="edit"
              isRound
              size="xs"
              onClick={openClientEditModal}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default OrderClientCard;
