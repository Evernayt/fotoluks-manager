import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { orderSlice } from 'store/reducers/OrderSlice';
import { NavmenuSearch } from 'components';

const OrdersSearch = () => {
  const search = useAppSelector((state) => state.order.search);

  const dispatch = useAppDispatch();

  const searchHandler = (search: string) => {
    dispatch(orderSlice.actions.setSearch(search));
  };

  return (
    <NavmenuSearch
      placeholder="Поиск заказов"
      value={search}
      onChange={(e) => searchHandler(e.target.value)}
    />
  );
};

export default OrdersSearch;
