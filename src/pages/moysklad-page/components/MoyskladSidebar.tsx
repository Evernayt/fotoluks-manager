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
  IconSquareLetterA,
} from '@tabler/icons-react';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import { checkAccessByLevel } from 'helpers/employee';

const MoyskladSidebar = () => {
  const activeSidebarIndex = useAppSelector(
    (state) => state.moysklad.activeSidebarIndex
  );
  const sidebarIsOpen = useAppSelector((state) => state.moysklad.sidebarIsOpen);
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();

  const items = useMemo<ISidebarItem[]>(() => {
    const publicItems = [
      {
        id: 1,
        Icon: IconSquareLetterA,
        name: 'Ассортимент',
      },
      {
        id: 2,
        Icon: IconSquareNumber1,
        name: 'Остатки',
      },
      {
        id: 3,
        Icon: IconTruckDelivery,
        name: 'Перемещение',
      },
      {
        id: 4,
        Icon: IconShoppingCart,
        name: 'Заканчивающиеся',
      },
    ];
    if (checkAccessByLevel(employee, 3)) {
      const privateItems = [
        {
          id: 5,
          Icon: IconCurrencyRubel,
          name: 'Обновить цены',
        },
        {
          id: 6,
          Icon: IconEggCracked,
          name: 'Брак',
        },
      ];
      publicItems.push(...privateItems);
    }
    return publicItems;
  }, []);

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
