import { Row } from '@tanstack/react-table';
import { getFileExtencion, getFileExtensionIcon } from 'helpers';
import { IOrderFile } from 'models/api/IOrderFile';
import { FC } from 'react';

interface OrderFilesExtencionCellProps {
  row: Row<IOrderFile>;
}

const OrderFilesExtencionCell: FC<OrderFilesExtencionCellProps> = ({ row }) => {
  return (
    <img
      src={getFileExtensionIcon(getFileExtencion(row.original.name))}
      style={{ minWidth: '32px', minHeight: '32px' }}
    />
  );
};

export default OrderFilesExtencionCell;
