import { Sidebar } from 'components';
import { ISidebarItem } from 'components/sidebar/Sidebar.types';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useMemo } from 'react';
import {
  IconShoppingCart,
  IconCurrencyRubel,
  IconSquareNumber1,
  IconTruckDelivery,
  IconEggCracked,
} from '@tabler/icons-react';
import { moyskladActions } from 'store/reducers/MoyskladSlice';

const MoyskladSidebar = () => {
  const activeSidebarIndex = useAppSelector(
    (state) => state.moysklad.activeSidebarIndex
  );
  const sidebarIsOpen = useAppSelector((state) => state.moysklad.sidebarIsOpen);

  const dispatch = useAppDispatch();

  const items = useMemo<ISidebarItem[]>(
    () => [
      {
        id: 0,
        Icon: IconSquareNumber1,
        name: 'Остатки',
      },
      {
        id: 1,
        Icon: IconTruckDelivery,
        name: 'Перемещение',
      },
      {
        id: 2,
        Icon: IconShoppingCart,
        name: 'Заканчивающиеся',
      },
      {
        id: 3,
        Icon: IconCurrencyRubel,
        name: 'Обновить цены',
      },
      {
        id: 4,
        Icon: IconEggCracked,
        name: 'Брак',
      },
    ],
    []
  );

  const toggleSidebar = () => {
    dispatch(moyskladActions.setSidebarIsOpen(!sidebarIsOpen));
  };

  const itemChangeHandler = (_item: ISidebarItem, index: number) => {
    dispatch(moyskladActions.setActiveSidebarIndex(index));
  };

  return (
    <Sidebar
      isOpen={sidebarIsOpen}
      items={items}
      selectedItem={items[activeSidebarIndex]}
      toggle={toggleSidebar}
      onChange={itemChangeHandler}
    />
  );
};

export default MoyskladSidebar;
