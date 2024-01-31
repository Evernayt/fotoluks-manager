import { IOrder } from 'models/api/IOrder';
import { FC } from 'react';
import { StatusSelect } from 'components';
import { Row } from '@tanstack/react-table';

interface OrderStatusCellProps {
  row: Row<IOrder>;
}

const OrderStatusCell: FC<OrderStatusCellProps> = ({ row }) => {
  return (
    <StatusSelect
      selectedStatus={row.original.status}
      order={row.original}
      containerClassName="cell_padding"
      popoverContentProps={{ top: '-7px' }}
    />
  );
};

export default OrderStatusCell;
