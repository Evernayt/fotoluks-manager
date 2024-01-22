import { Tag } from '@chakra-ui/react';
import { FC } from 'react';

interface StockCellProps {
  stock: number | undefined;
}

const StockCell: FC<StockCellProps> = ({ stock }) => {
  return (
    <Tag colorScheme={stock && stock > 0 ? 'green' : 'red'}>
      {stock ? stock : 0}
    </Tag>
  );
};

export default StockCell;
