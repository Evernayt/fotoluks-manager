import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { IFoundUsers } from 'models/IUser';
import { searchUsersAPI } from 'http/userAPI';
import { NavmenuSearch } from 'components';

const ControlPanelUsersSearch = () => {
  const [searchText, setSearchText] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchText, 500);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchUsers();
    } else {
      const foundUsersData: IFoundUsers = {
        userData: { rows: [], count: 0 },
        searchText,
      };
      dispatch(controlPanelSlice.actions.setFoundUsers(foundUsersData));
    }
  }, [debouncedSearchTerm]);

  const searchUsers = () => {
    if (searchText.trim() !== '') {
      dispatch(controlPanelSlice.actions.setIsLoading(true));

      searchUsersAPI(15, 1, searchText).then((data) => {
        const foundUsersData: IFoundUsers = {
          userData: { rows: data.rows, count: data.count },
          searchText,
        };
        dispatch(controlPanelSlice.actions.setFoundUsers(foundUsersData));
        dispatch(controlPanelSlice.actions.setIsLoading(false));
      });
    }
  };

  return (
    <NavmenuSearch
      placeholder="Поиск пользователей"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
  );
};

export default ControlPanelUsersSearch;
