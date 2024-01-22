import { Row } from '@tanstack/react-table';
import { useAppDispatch } from 'hooks/redux';
import { IEndingGood } from '../EndingGoodsTable';
import { FC } from 'react';
import { endingGoodsActions } from 'store/reducers/EndingGoodsSlice';
import { Button } from '@chakra-ui/react';

interface EndingGoodNotAvailableCellProps {
  row: Row<IEndingGood>;
}

const EndingGoodNotAvailableCell: FC<EndingGoodNotAvailableCellProps> = ({
  row,
}) => {
  const { good, notAvailable } = row.original;

  const dispatch = useAppDispatch();

  const toggleNotAvailable = () => {
    dispatch(endingGoodsActions.toggleNotAvailableByGoodId(good.id));

    if (notAvailable) {
      dispatch(endingGoodsActions.removeNotAvailableGood(good.id));
    } else {
      dispatch(endingGoodsActions.addNotAvailableGood(good.id));
    }
  };

  return (
    <Button
      variant={notAvailable ? 'solid' : 'outline'}
      colorScheme={notAvailable ? 'yellow' : 'gray'}
      w="100%"
      onClick={toggleNotAvailable}
    >
      {notAvailable ? 'Да' : 'Нет'}
    </Button>
  );
};

export default EndingGoodNotAvailableCell;
