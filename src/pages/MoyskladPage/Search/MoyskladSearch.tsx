import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { NavmenuSearch } from 'components';
import { moyskladSlice } from 'store/reducers/MoyskladSlice';

const MoyskladSearch = () => {
  const search = useAppSelector((state) => state.moysklad.search);

  const dispatch = useAppDispatch();

  const searchHandler = (search: string) => {
    dispatch(moyskladSlice.actions.setSearch(search));
  };

  return (
    <NavmenuSearch
      placeholder="Поиск"
      value={search}
      onChange={(e) => searchHandler(e.target.value)}
    />
  );
};

export default MoyskladSearch;
