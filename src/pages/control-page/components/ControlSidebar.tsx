import { Sidebar } from 'components';
import { ISidebarItem } from 'components/sidebar/Sidebar.types';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useMemo } from 'react';
import {
  IconUser,
  IconFriends,
  IconBuildingStore,
  IconMug,
} from '@tabler/icons-react';
import { controlActions } from 'store/reducers/ControlSlice';

const ControlSidebar = () => {
  const activeSidebarIndex = useAppSelector(
    (state) => state.control.activeSidebarIndex
  );
  const sidebarIsOpen = useAppSelector((state) => state.control.sidebarIsOpen);

  const dispatch = useAppDispatch();

  const items = useMemo<ISidebarItem[]>(
    () => [
      {
        id: 0,
        Icon: IconUser,
        name: 'Сотрудники',
      },
      {
        id: 1,
        Icon: IconFriends,
        name: 'Клиенты',
      },
      {
        id: 2,
        Icon: IconMug,
        name: 'Услуги',
      },
      {
        id: 3,
        Icon: IconBuildingStore,
        name: 'Филиалы',
      },
    ],
    []
  );

  const toggleSidebar = () => {
    dispatch(controlActions.setSidebarIsOpen(!sidebarIsOpen));
  };

  const itemChangeHandler = (_item: ISidebarItem, index: number) => {
    dispatch(controlActions.setActiveSidebarIndex(index));
  };

  return (
    <Sidebar
      isOpen={sidebarIsOpen}
      items={items}
      defaultActiveItem={items[activeSidebarIndex]}
      toggle={toggleSidebar}
      onChange={itemChangeHandler}
    />
  );
};

export default ControlSidebar;
