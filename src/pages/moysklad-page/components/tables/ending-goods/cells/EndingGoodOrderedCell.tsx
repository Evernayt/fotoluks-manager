import { Row } from '@tanstack/react-table';
import { useAppDispatch } from 'hooks/redux';
import { IEndingGood } from '../EndingGoodsTable';
import { FC } from 'react';
import { endingGoodsActions } from 'store/reducers/EndingGoodsSlice';
import { Button } from '@chakra-ui/react';

interface EndingGoodOrderedCellProps {
  row: Row<IEndingGood>;
}

const EndingGoodOrderedCell: FC<EndingGoodOrderedCellProps> = ({ row }) => {
  const { good, ordered } = row.original;

  const dispatch = useAppDispatch();

  const toggleOrdered = () => {
    dispatch(endingGoodsActions.toggleOrderedByGoodId(good.id));

    if (ordered) {
      dispatch(endingGoodsActions.removeOrderedGood(good.id));
    } else {
      dispatch(endingGoodsActions.addOrderedGood(good.id));
    }
  };

  return (
    <Button
      variant={ordered ? 'solid' : 'outline'}
      colorScheme={ordered ? 'yellow' : 'gray'}
      w="100%"
      onClick={toggleOrdered}
    >
      {ordered ? 'Да' : 'Нет'}
    </Button>
  );
};

export default EndingGoodOrderedCell;
