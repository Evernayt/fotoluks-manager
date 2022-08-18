import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { searchIcon } from 'icons';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import styles from './ControlPanelCategoriesSearch.module.css';
import { IFoundCategories } from 'models/ICategory';

const ControlPanelCategoriesSearch = () => {
  const [searchText, setSearchText] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchText, 500);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchTypes();
    } else {
      const foundCategoriesData: IFoundCategories = {
        categoryData: { rows: [], count: 0 },
        searchText,
      };
      dispatch(
        controlPanelSlice.actions.setFoundCategories(foundCategoriesData)
      );
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
        placeholder="Поиск категорий"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        disabled
      />
    </div>
  );
};

export default ControlPanelCategoriesSearch;
