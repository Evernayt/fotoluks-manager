import { Sidebar } from 'components';
import {
  ISidebarAddButton,
  ISidebarItem,
} from 'components/sidebar/Sidebar.types';
import { TASK_DETAIL_ROUTE } from 'constants/paths';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconNotebook,
  IconCircle,
  IconCircleCheck,
  IconLock,
} from '@tabler/icons-react';
import { taskActions } from 'store/reducers/TaskSlice';

interface ITaskSidebarItem extends ISidebarItem {
  status: number;
}

const TasksSidebar = () => {
  const activeSidebarIndex = useAppSelector(
    (state) => state.task.activeSidebarIndex
  );
  const sidebarIsOpen = useAppSelector((state) => state.task.sidebarIsOpen);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const items = useMemo<ITaskSidebarItem[]>(
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
        Icon: IconCircleCheck,
        name: 'Завершенные',
        status: 2,
      },
      {
        id: 3,
        Icon: IconLock,
        name: 'Личное',
        status: 3,
      },
    ],
    []
  );

  const toggleSidebar = () => {
    dispatch(taskActions.setSidebarIsOpen(!sidebarIsOpen));
  };

  const itemChangeHandler = (item: ITaskSidebarItem, index: number) => {
    dispatch(taskActions.setActiveStatus(item.status));
    dispatch(taskActions.setActiveSidebarIndex(index));
  };

  const addButton: ISidebarAddButton = {
    name: 'Новая задача',
    onClick: () => navigate(TASK_DETAIL_ROUTE),
  };

  return (
    <Sidebar
      isOpen={sidebarIsOpen}
      addButton={addButton}
      items={items}
      defaultActiveItem={items[activeSidebarIndex]}
      toggle={toggleSidebar}
      onChange={itemChangeHandler}
    />
  );
};

export default TasksSidebar;
