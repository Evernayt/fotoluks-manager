import { Row } from '@tanstack/react-table';
import { ISupply } from 'models/api/moysklad/ISupply';
import { FC } from 'react';

interface SupplyProductQuantityCellProps {
  row: Row<ISupply>;
}

const SupplyProductQuantity: FC<SupplyProductQuantityCellProps> = ({ row }) => {
  const rows = row.original.positions.rows;
  const quantity = rows && rows.length > 0 ? rows[0].quantity : 0;

  return <>{quantity}</>;
};

export default SupplyProductQuantity;
