import { Button } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch } from 'hooks/redux';
import { INotification } from 'models/api/moysklad/INotification';
import { Cell } from 'react-table';
import { endingGoodsSlice } from 'store/reducers/EndingGoodsSlice';

const NotAvailableButtonCell = ({ row }: Cell<INotification>) => {
  const { good, notAvailable } = row.original;

  const dispatch = useAppDispatch();

  const toggleNotAvailable = () => {
    dispatch(endingGoodsSlice.actions.toggleNotAvailableByGoodId(good.id));

    if (notAvailable) {
      dispatch(endingGoodsSlice.actions.removeNotAvailableGood(good.id));
    } else {
      dispatch(endingGoodsSlice.actions.addNotAvailableGood(good.id));
    }
  };

  return (
    <Button
      variant={
        notAvailable
          ? ButtonVariants.primaryDeemphasized
          : ButtonVariants.default
      }
      onClick={toggleNotAvailable}
    >
      {notAvailable ? 'Да' : 'Нет'}
    </Button>
  );
};

export default NotAvailableButtonCell;
