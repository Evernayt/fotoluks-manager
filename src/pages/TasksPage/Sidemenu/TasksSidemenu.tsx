import { Sidemenu } from 'components';
import { ISidemenuAddButton } from 'components/Sidemenu/Sidemenu.types';
import { TASKS_DETAIL_ROUTE } from 'constants/paths';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconCheck, IconCircle, IconNotebook } from 'icons';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskSlice } from 'store/reducers/TaskSlice';
import { ITaskSidemenuItem } from './TasksSidemenu.types';

const TasksSidemenu = () => {
  const activeSidemenuIndex = useAppSelector(
    (state) => state.task.activeSidemenuIndex
  );
  const sidemenuIsOpen = useAppSelector((state) => state.task.sidemenuIsOpen);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const items = useMemo<ITaskSidemenuItem[]>(
    () => [
      {
        id: 0,
        name: 'Все задачи',
        Icon: IconNotebook,
        status: 0,
      },
      {
        id: 1,
        Icon: IconCircle,
        name: 'Незавершенные',
        status: 1,
      },
      {
        id: 2,
        Icon: IconCheck,
        name: 'Завершенные',
        status: 2,
      },
    ],
    []
  );

  const toggleSidemenu = () => {
    dispatch(taskSlice.actions.setSidemenuIsOpen(!sidemenuIsOpen));
  };

  const changeHandler = (item: ITaskSidemenuItem, index: number) => {
    dispatch(taskSlice.actions.setActiveStatus(item.status));
    dispatch(taskSlice.actions.setActiveSidemenuIndex(index));
  };

  const addButton: ISidemenuAddButton = {
    text: 'Новая задача',
    onClick: () => navigate(TASKS_DETAIL_ROUTE),
  };

  return (
    <Sidemenu
      isOpen={sidemenuIsOpen}
      addButton={addButton}
      items={items}
      defaultActiveItem={items[activeSidemenuIndex]}
      toggle={toggleSidemenu}
      onChange={changeHandler}
    />
  );
};

export default TasksSidemenu;
