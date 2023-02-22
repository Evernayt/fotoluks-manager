import { Button } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch } from 'hooks/redux';
import { INotification } from 'models/api/moysklad/INotification';
import { Cell } from 'react-table';
import { endingGoodsSlice } from 'store/reducers/EndingGoodsSlice';

const OrderedButtonCell = ({ row }: Cell<INotification>) => {
  const { good, ordered } = row.original;

  const dispatch = useAppDispatch();

  const toggleOrdered = () => {
    dispatch(endingGoodsSlice.actions.toggleOrderedByGoodId(good.id));

    if (ordered) {
      dispatch(endingGoodsSlice.actions.removeOrderedGood(good.id));
    } else {
      dispatch(endingGoodsSlice.actions.addOrderedGood(good.id));
    }
  };

  return (
    <Button
      variant={
        ordered ? ButtonVariants.primaryDeemphasized : ButtonVariants.default
      }
      onClick={toggleOrdered}
    >
      {ordered ? 'Да' : 'Нет'}
    </Button>
  );
};

export default OrderedButtonCell;
