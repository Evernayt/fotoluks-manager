import { ISupply } from 'models/api/moysklad/ISupply';
import { getDateDiffDays } from 'helpers';
import { Row } from '@tanstack/react-table';
import { FC } from 'react';
import { Badge } from '@chakra-ui/react';

const isReturnPossible = (incomingDate: string | undefined) => {
  if (incomingDate) {
    const days = getDateDiffDays(incomingDate);

    if (days > 60) {
      return { text: 'Нельзя вернуть', isCanReturn: false };
    } else {
      return { text: 'Можно вернуть', isCanReturn: true };
    }
  } else {
    return { text: 'Не проведено', isCanReturn: null };
  }
};

interface DefectiveGoodsStatusCellProps {
  row: Row<ISupply>;
}

const DefectiveGoodsStatusCell: FC<DefectiveGoodsStatusCellProps> = ({
  row,
}) => {
  const { text, isCanReturn } = isReturnPossible(row.original.incomingDate);

  return (
    <Badge
      colorScheme={
        isCanReturn ? 'green' : isCanReturn === null ? 'gray' : 'red'
      }
    >
      {text}
    </Badge>
  );
};

export default DefectiveGoodsStatusCell;
