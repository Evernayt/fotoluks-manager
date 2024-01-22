import { IOrder } from 'models/api/IOrder';
import { FC } from 'react';
import { Row } from '@tanstack/react-table';
import moment from 'moment';
import { UI_DATE_FORMAT, NOT_INDICATED } from 'constants/app';

interface OrderDeadlineCellProps {
  row: Row<IOrder>;
}

const OrderDeadlineCell: FC<OrderDeadlineCellProps> = ({ row }) => {
  const deadline = row.original.deadline;
  const isDeadlinePass =
    Date.parse(deadline) < Date.now() &&
    ['Новый', 'В работе'].includes(row.original.status!.name);

  return (
    <span
      className="row_nowrap"
      style={isDeadlinePass ? { color: '#FF7613' } : {}}
    >
      {deadline ? moment(deadline).format(UI_DATE_FORMAT) : NOT_INDICATED}
    </span>
  );
};

export default OrderDeadlineCell;
