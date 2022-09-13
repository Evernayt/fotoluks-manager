import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { IFoundParams } from 'models/IParam';
import { searchParamsAPI } from 'http/paramAPI';
import { NavmenuSearch } from 'components';

const ControlPanelParamsSearch = () => {
  const [searchText, setSearchText] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchText, 500);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchParams();
    } else {
      const foundParamsData: IFoundParams = {
        paramData: { rows: [], count: 0 },
        searchText,
      };
      dispatch(controlPanelSlice.actions.setFoundParams(foundParamsData));
    }
  }, [debouncedSearchTerm]);

  const searchParams = () => {
    if (searchText.trim() !== '') {
      dispatch(controlPanelSlice.actions.setIsLoading(true));

      searchParamsAPI(15, 1, searchText).then((data) => {
        const foundParamsData: IFoundParams = {
          paramData: { rows: data.rows, count: data.count },
          searchText,
        };
        dispatch(controlPanelSlice.actions.setFoundParams(foundParamsData));
        dispatch(controlPanelSlice.actions.setIsLoading(false));
      });
    }
  };

  return (
    <NavmenuSearch
      placeholder="Поиск параметров"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
  );
};

export default ControlPanelParamsSearch;
