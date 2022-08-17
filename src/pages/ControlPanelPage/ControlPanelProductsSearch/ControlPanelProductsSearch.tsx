import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { searchIcon } from 'icons';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import styles from './ControlPanelProductsSearch.module.css';
import { IFoundProducts } from 'models/IProduct';

const ControlPanelProductsSearch = () => {
  const [searchText, setSearchText] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchText, 500);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchTypes();
    } else {
      const foundProductsData: IFoundProducts = {
        productData: { rows: [], count: 0 },
        searchText,
      };
      dispatch(controlPanelSlice.actions.setFoundProducts(foundProductsData));
    }
  }, [debouncedSearchTerm]);

  const searchTypes = () => {
    if (searchText.trim() !== '') {
      dispatch(controlPanelSlice.actions.setIsLoading(true));

      // searchUsersAPI(15, 1, searchText).then((data) => {
      //   const foundUsersData: IFoundUsers = {
      //     userData: { rows: data.rows, count: data.count },
      //     searchText,
      //   };
      //   dispatch(controlPanelSlice.actions.setFoundUsers(foundUsersData));
      //   dispatch(controlPanelSlice.actions.setIsLoading(false));
      // });
    }
  };

  return (
    <div className={styles.input_container}>
      <img className={styles.icon} src={searchIcon} alt="search-icon" />
      <input
        className={styles.input}
        placeholder="Поиск продуктов"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        disabled
      />
    </div>
  );
};

export default ControlPanelProductsSearch;
