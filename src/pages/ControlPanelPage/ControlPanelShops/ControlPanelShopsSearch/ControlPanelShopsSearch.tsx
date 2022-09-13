import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { IFoundShops } from 'models/IShop';
import { searchShopsAPI } from 'http/shopAPI';
import { NavmenuSearch } from 'components';

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
    <NavmenuSearch
      placeholder="Поиск филиалов"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
  );
};

export default ControlPanelShopsSearch;
