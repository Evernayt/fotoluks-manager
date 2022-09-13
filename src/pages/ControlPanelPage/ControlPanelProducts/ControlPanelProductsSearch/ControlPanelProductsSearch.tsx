import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { IFoundProducts } from 'models/IProduct';
import { searchProductsAPI } from 'http/productAPI';
import { NavmenuSearch } from 'components';

const ControlPanelProductsSearch = () => {
  const [searchText, setSearchText] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchText, 500);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchProducts();
    } else {
      const foundProductsData: IFoundProducts = {
        productData: { rows: [], count: 0 },
        searchText,
      };
      dispatch(controlPanelSlice.actions.setFoundProducts(foundProductsData));
    }
  }, [debouncedSearchTerm]);

  const searchProducts = () => {
    if (searchText.trim() !== '') {
      dispatch(controlPanelSlice.actions.setIsLoading(true));

      searchProductsAPI(15, 1, searchText).then((data) => {
        const foundProductsData: IFoundProducts = {
          productData: { rows: data.rows, count: data.count },
          searchText,
        };
        dispatch(controlPanelSlice.actions.setFoundProducts(foundProductsData));
        dispatch(controlPanelSlice.actions.setIsLoading(false));
      });
    }
  };

  return (
    <NavmenuSearch
      placeholder="Поиск продуктов"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
  );
};

export default ControlPanelProductsSearch;
