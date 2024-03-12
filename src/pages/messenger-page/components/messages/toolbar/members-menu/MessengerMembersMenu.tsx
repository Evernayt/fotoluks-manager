import { FC } from 'react';
import { Menu, MenuButton, MenuList, Text } from '@chakra-ui/react';
import { IChatMember } from 'models/api/IChatMember';
import { useAppSelector } from 'hooks/redux';
import MessengerMemberItem from './member/MessengerMemberItem';
import { IEmployee } from 'models/api/IEmployee';
import styles from './MessengerMembersMenu.module.scss';

interface MessengerMembersMenuProps {
  chatMembers: IChatMember[];
  creator: IEmployee;
}

const MessengerMembersMenu: FC<MessengerMembersMenuProps> = ({
  chatMembers,
  creator,
}) => {
  const onlineEmployees = useAppSelector((state) => state.app.onlineEmployees);

  const getMembers = () => {
    return chatMembers
      .map((chatMember) => chatMember.employee?.name)
      .join(', ');
  };

  return (
    <Menu autoSelect={false}>
      <MenuButton>
        <Text className={styles.names} variant="secondary">
          {getMembers()}
        </Text>
      </MenuButton>
      <MenuList className={styles.items}>
        {chatMembers.map((chatMember) => {
          const isOnline = onlineEmployees.some(
            (x) => x.employeeId === chatMember.employee.id
          );
          return (
            <MessengerMemberItem
              employee={chatMember.employee}
              isOnline={isOnline}
              isCreator={chatMember.employee.id === creator.id}
              key={chatMember.id}
            />
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default MessengerMembersMenu;
