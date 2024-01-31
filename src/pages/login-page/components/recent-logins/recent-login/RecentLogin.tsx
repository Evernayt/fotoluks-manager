import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IEmployee } from 'models/api/IEmployee';
import { FC, memo } from 'react';
import { Avatar, Card, IconButton, Text, useToast } from '@chakra-ui/react';
import { modalActions } from 'store/reducers/ModalSlice';
import { IconX } from '@tabler/icons-react';
import { getEmployeeFullName } from 'helpers/employee';
import { getInfoToast } from 'helpers/toast';
import styles from './RecentLogin.module.scss';

interface RecentLoginProps {
  employee: IEmployee;
  removeRecentLogin: (userId: number) => void;
}

const RecentLogin: FC<RecentLoginProps> = memo(
  ({ employee, removeRecentLogin }) => {
    const activeShop = useAppSelector((state) => state.app.activeShop);

    const dispatch = useAppDispatch();
    const toast = useToast();

    const openLoginModal = () => {
      if (activeShop.id === 0) {
        toast(getInfoToast('Филиал не выбран'));
        return;
      }
      dispatch(
        modalActions.openModal({
          modal: 'loginModal',
          props: { employee },
        })
      );
    };

    return (
      <Card className={styles.container}>
        <IconButton
          icon={<IconX size={14} />}
          aria-label="close"
          isRound
          position="absolute"
          zIndex={1}
          size="xs"
          m={1}
          variant="ghost"
          onClick={() => removeRecentLogin(employee.id)}
        />
        <div onClick={openLoginModal}>
          <Avatar
            name={getEmployeeFullName(employee)}
            src={employee.avatar || undefined}
            boxSize="160px"
            borderRadius="var(--border-radius) var(--border-radius) 0 0"
            size="2xl"
          />
          <Text className={styles.user_name} variant="secondary">
            {employee.name}
          </Text>
        </div>
      </Card>
    );
  }
);

export default RecentLogin;
