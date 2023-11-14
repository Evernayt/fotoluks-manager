import { IOrder } from 'models/api/IOrder';
import { FC } from 'react';
import { Cell } from 'react-table';
import styles from './OrderDeadlineCell.module.scss';

interface OrderDeadlineCellProps {
  cell: Cell<IOrder>;
}

const OrderDeadlineCell: FC<OrderDeadlineCellProps> = ({ cell }) => {
  const isDeadlinePass =
    Date.parse(cell.value) < Date.now() &&
    ['Новый', 'В работе'].includes(cell.row.original.status!.name);

  return (
    <span
      className={styles.container}
      style={isDeadlinePass ? { color: '#FF7613' } : {}}
    >
      {cell.render('Cell')}
    </span>
  );
};

export default OrderDeadlineCell;
