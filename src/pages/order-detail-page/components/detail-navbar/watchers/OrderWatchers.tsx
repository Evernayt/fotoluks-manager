import { useAppSelector } from 'hooks/redux';
import {
  Avatar,
  AvatarGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { FC, useMemo } from 'react';
import { getEmployeeFullName } from 'helpers/employee';

interface OrderWatchersProps {
  orderId: number;
  employeeId: number;
}

const OrderWatchers: FC<OrderWatchersProps> = ({ orderId, employeeId }) => {
  const watchers = useAppSelector((state) => state.order.watchers);

  const filteredWatchers = useMemo(() => {
    return watchers.filter(
      (x) => x.orderId === orderId && x.employee.id !== employeeId
    );
  }, [watchers]);

  return (
    <Menu autoSelect={false}>
      <Tooltip label="Заказ смотрят" placement="left">
        <MenuButton>
          <AvatarGroup max={3}>
            {filteredWatchers.map((watcher) => (
              <Avatar
                name={getEmployeeFullName(watcher.employee)}
                src={watcher.employee.avatar || undefined}
                key={watcher.employee.id}
              />
            ))}
          </AvatarGroup>
        </MenuButton>
      </Tooltip>
      <MenuList>
        {filteredWatchers.map((watcher) => (
          <MenuItem key={watcher.employee.id}>
            <Avatar
              name={getEmployeeFullName(watcher.employee)}
              src={watcher.employee.avatar || undefined}
              h="35px"
              w="35px"
              mr="12px"
            />
            <Text>{getEmployeeFullName(watcher.employee)}</Text>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default OrderWatchers;
