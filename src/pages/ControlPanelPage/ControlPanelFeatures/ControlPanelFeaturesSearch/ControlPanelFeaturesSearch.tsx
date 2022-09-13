import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { IFoundFeatures } from 'models/IFeature';
import { searchFeaturesAPI } from 'http/featureAPI';
import { NavmenuSearch } from 'components';

const ControlPanelFeaturesSearch = () => {
  const [searchText, setSearchText] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchText, 500);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchFeatures();
    } else {
      const foundFeaturesData: IFoundFeatures = {
        featureData: { rows: [], count: 0 },
        searchText,
      };
      dispatch(controlPanelSlice.actions.setFoundFeatures(foundFeaturesData));
    }
  }, [debouncedSearchTerm]);

  const searchFeatures = () => {
    if (searchText.trim() !== '') {
      dispatch(controlPanelSlice.actions.setIsLoading(true));

      searchFeaturesAPI(15, 1, searchText).then((data) => {
        const foundFeaturesData: IFoundFeatures = {
          featureData: { rows: data.rows, count: data.count },
          searchText,
        };
        dispatch(controlPanelSlice.actions.setFoundFeatures(foundFeaturesData));
        dispatch(controlPanelSlice.actions.setIsLoading(false));
      });
    }
  };

  return (
    <NavmenuSearch
      placeholder="Поиск характеристик"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
  );
};

export default ControlPanelFeaturesSearch;
