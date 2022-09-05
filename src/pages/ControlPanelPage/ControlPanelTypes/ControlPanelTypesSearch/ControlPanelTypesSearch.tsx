import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { searchIcon } from 'icons';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { IFoundTypes } from 'models/IType';
import styles from './ControlPanelTypesSearch.module.css';

const ControlPanelTypesSearch = () => {
  const [searchText, setSearchText] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchText, 500);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchTypes();
    } else {
      const foundTypesData: IFoundTypes = {
        typeData: { rows: [], count: 0 },
        searchText,
      };
      dispatch(controlPanelSlice.actions.setFoundTypes(foundTypesData));
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
        placeholder="Поиск товаров"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        disabled
      />
    </div>
  );
};

export default ControlPanelTypesSearch;
