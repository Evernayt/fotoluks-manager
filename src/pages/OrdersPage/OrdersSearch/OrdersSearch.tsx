import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { searchOrdersAPI } from 'http/orderAPI';
import { useEffect, useState } from 'react';
import { searchIcon } from 'icons';
import { IFoundOrders } from 'models/IOrder';
import { orderSlice } from 'store/reducers/OrderSlice';
import styles from './OrdersSearch.module.css';

const OrdersSearch = () => {
  const [searchText, setSearchText] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchText, 500);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchOrders();
    } else {
      const foundOrdersData: IFoundOrders = {
        orderData: { rows: [], count: 0 },
        searchText,
      };
      dispatch(orderSlice.actions.setFoundOrders(foundOrdersData));
    }
  }, [debouncedSearchTerm]);

  const searchOrders = () => {
    if (searchText.trim() !== '') {
      dispatch(orderSlice.actions.setIsLoading(true));

      searchOrdersAPI(15, 1, searchText).then((data) => {
        const foundOrdersData: IFoundOrders = {
          orderData: { rows: data.rows, count: data.count },
          searchText,
        };
        dispatch(orderSlice.actions.setFoundOrders(foundOrdersData));
        dispatch(orderSlice.actions.setIsLoading(false));
      });
    }
  };

  return (
    <div className={styles.input_container}>
      <img className={styles.icon} src={searchIcon} alt="search-icon" />
      <input
        className={styles.input}
        placeholder="Поиск заказов"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default OrdersSearch;
