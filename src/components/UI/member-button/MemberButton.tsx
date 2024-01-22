import { FC } from 'react';
import { Avatar, Button } from '@chakra-ui/react';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { IEmployee } from 'models/api/IEmployee';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { getEmployeeFullName, getEmployeeShortName } from 'helpers/employee';

interface MemberButtonProps {
  employee: IEmployee;
  isPlus?: boolean;
  onClick?: () => void;
}

const MemberButton: FC<MemberButtonProps> = ({
  employee,
  isPlus = false,
  onClick,
}) => {
  return (
    <Button
      leftIcon={
        <Avatar
          name={getEmployeeFullName(employee)}
          src={employee.avatar || undefined}
          size="sm"
        />
      }
      rightIcon={
        isPlus ? (
          <IconPlus size={ICON_SIZE} stroke={ICON_STROKE} />
        ) : (
          <IconMinus size={ICON_SIZE} stroke={ICON_STROKE} />
        )
      }
      variant="ghost"
      pl="3.5px"
      onClick={onClick}
    >
      {getEmployeeShortName(employee)}
    </Button>
  );
};

export default MemberButton;
