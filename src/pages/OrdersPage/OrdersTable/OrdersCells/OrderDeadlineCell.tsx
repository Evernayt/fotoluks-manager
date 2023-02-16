import { IOrder } from 'models/api/IOrder';
import { FC } from 'react';
import { Cell } from 'react-table';

interface OrderDeadlineCellProps {
  cell: Cell<IOrder>;
}

const OrderDeadlineCell: FC<OrderDeadlineCellProps> = ({ cell }) => {
  const isDeadlinePass =
    Date.parse(cell.value) < Date.now() &&
    ['Новый', 'В работе'].includes(cell.row.original.status!.name);

  return (
    <span style={isDeadlinePass ? { color: '#FF7613' } : {}}>
      {cell.render('Cell')}
    </span>
  );
};

export default OrderDeadlineCell;
