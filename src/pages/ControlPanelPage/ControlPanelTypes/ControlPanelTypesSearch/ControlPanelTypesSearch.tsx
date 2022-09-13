import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { IFoundTypes } from 'models/IType';
import { searchTypesAPI } from 'http/typeAPI';
import { NavmenuSearch } from 'components';

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

      searchTypesAPI(15, 1, searchText).then((data) => {
        const foundTypesData: IFoundTypes = {
          typeData: { rows: data.rows, count: data.count },
          searchText,
        };
        dispatch(controlPanelSlice.actions.setFoundTypes(foundTypesData));
        dispatch(controlPanelSlice.actions.setIsLoading(false));
      });
    }
  };

  return (
    <NavmenuSearch
      placeholder="Поиск товаров"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
  );
};

export default ControlPanelTypesSearch;
