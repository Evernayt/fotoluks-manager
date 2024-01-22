import { Badge } from '@chakra-ui/react';
import { FC } from 'react';

interface EmployeeConnectionStateProps {
  connectionState: 'В сети' | 'Не в сети';
}

const EmployeeConnectionState: FC<EmployeeConnectionStateProps> = ({
  connectionState,
}) => {
  return (
    <Badge colorScheme={connectionState === 'В сети' ? 'green' : 'red'}>
      {connectionState}
    </Badge>
  );
};

export default EmployeeConnectionState;
