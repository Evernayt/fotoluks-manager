import { useDebounce } from 'hooks';
import { useAppDispatch } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { searchIcon } from 'icons';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import styles from './ControlPanelFeaturesSearch.module.css';
import { IFoundFeatures } from 'models/IFeature';
import { searchFeaturesAPI } from 'http/featureAPI';

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
    <div className={styles.input_container}>
      <img className={styles.icon} src={searchIcon} alt="search-icon" />
      <input
        className={styles.input}
        placeholder="Поиск характеристик"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default ControlPanelFeaturesSearch;
