import { Avatar, Badge, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { getEmployeeFullName } from 'helpers/employee';
import { IEmployee } from 'models/api/IEmployee';
import styles from './MessengerMemberItem.module.scss';

interface MessengerMemberItemProps {
  employee: IEmployee;
  isOnline: boolean;
  isCreator: boolean;
}

const MessengerMemberItem: FC<MessengerMemberItemProps> = ({
  employee,
  isOnline,
  isCreator,
}) => {
  const employeeName = getEmployeeFullName(employee);

  return (
    <div className={styles.item}>
      <Avatar
        name={employeeName}
        src={employee?.avatar || undefined}
        mr="12px"
      />
      <div>
        <Text>{employeeName}</Text>
        <div>
          <Badge colorScheme={isOnline ? 'green' : 'red'}>
            {isOnline ? 'В сети' : 'Не в сети'}
          </Badge>
          {isCreator && <Badge ml="var(--space-sm)">Админ чата</Badge>}
        </div>
      </div>
    </div>
  );
};

export default MessengerMemberItem;
