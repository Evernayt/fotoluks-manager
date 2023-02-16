import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { NavmenuSearch } from 'components';

const ControlPanelSearch = () => {
  const search = useAppSelector((state) => state.controlPanel.search);

  const dispatch = useAppDispatch();

  const searchHandler = (search: string) => {
    dispatch(controlPanelSlice.actions.setSearch(search));
  };

  return (
    <NavmenuSearch
      placeholder="Поиск"
      value={search}
      onChange={(e) => searchHandler(e.target.value)}
    />
  );
};

export default ControlPanelSearch;
