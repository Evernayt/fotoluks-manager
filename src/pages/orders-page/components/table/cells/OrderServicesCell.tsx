import { Row } from '@tanstack/react-table';
import { IOrder } from 'models/api/IOrder';
import { FC } from 'react';
import { createServicesName } from '../OrdersTable.service';
import { Tooltip } from '@chakra-ui/react';

interface OrderServicesCellProps {
  row: Row<IOrder>;
}

const OrderServicesCell: FC<OrderServicesCellProps> = ({ row }) => {
  return (
    <Tooltip
      label={`— Комментарий —\n${row.original.comment}`}
      openDelay={500}
      whiteSpace="pre-line"
      isDisabled={row.original.comment === ''}
    >
      <div className="row_full cell_padding" data-clickable>
        {createServicesName(row.original.orderProducts || [])}
      </div>
    </Tooltip>
  );
};

export default OrderServicesCell;
