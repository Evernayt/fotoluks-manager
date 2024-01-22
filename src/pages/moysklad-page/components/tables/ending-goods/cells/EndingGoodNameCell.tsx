import { Row } from '@tanstack/react-table';
import { IEndingGood } from '../EndingGoodsTable';
import { FC } from 'react';

interface EndingGoodNameCellProps {
  row: Row<IEndingGood>;
}

const EndingGoodNameCell: FC<EndingGoodNameCellProps> = ({ row }) => {
  return (
    <span
      className="row_full"
      style={row.original.active ? { color: '#14a44d' } : {}}
    >
      {row.original.good.name}
    </span>
  );
};

export default EndingGoodNameCell;
