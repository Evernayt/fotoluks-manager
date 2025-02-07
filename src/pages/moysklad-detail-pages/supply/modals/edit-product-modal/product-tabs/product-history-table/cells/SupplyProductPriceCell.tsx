import { Row } from '@tanstack/react-table';
import { ISupply } from 'models/api/moysklad/ISupply';
import { FC } from 'react';

interface SupplyProductPriceCellProps {
  row: Row<ISupply>;
}

const SupplyProductPrice: FC<SupplyProductPriceCellProps> = ({ row }) => {
  const rows = row.original.positions.rows;
  const currentPrice = rows && rows.length > 0 ? rows[0].price || 0 : 0;
  const price = Math.round(currentPrice) / 100;

  return <>{price}</>;
};

export default SupplyProductPrice;
