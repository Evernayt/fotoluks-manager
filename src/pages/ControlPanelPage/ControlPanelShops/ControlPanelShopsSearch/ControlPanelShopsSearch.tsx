import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { searchIcon } from 'icons';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import styles from './ControlPanelShopsSearch.module.css';
import { IFoundShops } from 'models/IShop';
import { searchShopsAPI } from 'http/shopAPI';

const ControlPanelShopsSearch = () => {
  const [searchText, setSearchText] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchText, 500);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchShops();
    } else {
      const foundShopsData: IFoundShops = {
        shopData: { rows: [], count: 0 },
        searchText,
      };
      dispatch(controlPanelSlice.actions.setFoundShops(foundShopsData));
    }
  }, [debouncedSearchTerm]);

  const searchShops = () => {
    if (searchText.trim() !== '') {
      dispatch(controlPanelSlice.actions.setIsLoading(true));

      searchShopsAPI(15, 1, searchText).then((data) => {
        const foundShopsData: IFoundShops = {
          shopData: { rows: data.rows, count: data.count },
          searchText,
        };
        dispatch(controlPanelSlice.actions.setFoundShops(foundShopsData));
        dispatch(controlPanelSlice.actions.setIsLoading(false));
      });
    }
  };

  return (
    <div className={styles.input_container}>
      <img className={styles.icon} src={searchIcon} alt="search-icon" />
      <input
        className={styles.input}
        placeholder="Поиск филиалов"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default ControlPanelShopsSearch;
