import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { NavmenuSearch } from 'components';
import { taskSlice } from 'store/reducers/TaskSlice';

const TasksSearch = () => {
  const search = useAppSelector((state) => state.task.search);

  const dispatch = useAppDispatch();

  const searchHandler = (search: string) => {
    dispatch(taskSlice.actions.setSearch(search));
  };

  return (
    <NavmenuSearch
      placeholder="Поиск задач"
      value={search}
      onChange={(e) => searchHandler(e.target.value)}
    />
  );
};

export default TasksSearch;
