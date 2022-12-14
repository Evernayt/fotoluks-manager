import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { IFoundCategories } from 'models/ICategory';
import { searchCategoriesAPI } from 'http/categoryAPI';
import { NavmenuSearch } from 'components';

const ControlPanelCategoriesSearch = () => {
  const [searchText, setSearchText] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchText, 500);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchCategories();
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

  const searchCategories = () => {
    if (searchText.trim() !== '') {
      dispatch(controlPanelSlice.actions.setIsLoading(true));

      searchCategoriesAPI(15, 1, searchText).then((data) => {
        const foundCategoriesData: IFoundCategories = {
          categoryData: { rows: data.rows, count: data.count },
          searchText,
        };
        dispatch(
          controlPanelSlice.actions.setFoundCategories(foundCategoriesData)
        );
        dispatch(controlPanelSlice.actions.setIsLoading(false));
      });
    }
  };

  return (
    <NavmenuSearch
      placeholder="Поиск категорий"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
  );
};

export default ControlPanelCategoriesSearch;
