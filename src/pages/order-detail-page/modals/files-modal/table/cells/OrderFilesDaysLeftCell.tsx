import { Badge } from '@chakra-ui/react';
import { MAX_FILE_STORAGE_DAYS } from 'constants/app';
import { getDateDiff } from 'helpers';
import moment from 'moment';
import { FC } from 'react';

interface OrderFilesDaysLeftCellProps {
  createdAt: string | undefined;
}

const OrderFilesDaysLeftCell: FC<OrderFilesDaysLeftCellProps> = ({
  createdAt,
}) => {
  const deletionDate = moment(createdAt)
    .add(MAX_FILE_STORAGE_DAYS, 'days')
    .toISOString();
  const dateDiff = getDateDiff(deletionDate);
  const isEnding = dateDiff.delta <= 259200;

  return createdAt ? (
    <Badge
      colorScheme={isEnding ? 'red' : 'gray'}
    >{`До удаления: ${dateDiff.diff}`}</Badge>
  ) : null;
};

export default OrderFilesDaysLeftCell;
