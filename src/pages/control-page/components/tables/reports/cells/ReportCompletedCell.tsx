import { Badge } from '@chakra-ui/react';
import { FC } from 'react';

interface ReportCompletedCellProps {
  completed: boolean;
}

const ReportCompletedCell: FC<ReportCompletedCellProps> = ({ completed }) => {
  return (
    <Badge colorScheme={completed ? 'green' : 'red'}>
      {completed ? 'Выполнено' : 'Не выполнено'}
    </Badge>
  );
};

export default ReportCompletedCell;
