import { Sidebar } from 'components';
import {
  ISidebarAddButton,
  ISidebarItem,
} from 'components/sidebar/Sidebar.types';
import { ORDER_DETAIL_ROUTE } from 'constants/paths';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IStatus } from 'models/api/IStatus';
import { useNavigate } from 'react-router-dom';
import { orderActions } from 'store/reducers/OrderSlice';
import {
  IconInbox,
  IconBolt,
  IconWritingSign,
  IconBoxSeam,
  IconDirectionSign,
  IconArchive,
  IconPackages,
} from '@tabler/icons-react';

const items: ISidebarItem[] = [
  {
    id: 0,
    Icon: IconInbox,
    name: 'Все заказы',
  },
  {
    id: 6,
    Icon: IconPackages,
    name: 'Не отданные',
  },
  {
    id: 1,
    Icon: IconBolt,
    name: 'Новые',
  },
  {
    id: 2,
    Icon: IconWritingSign,
    name: 'В работе',
  },
  {
    id: 3,
    Icon: IconBoxSeam,
    name: 'Готовые',
  },
  {
    id: 4,
    Icon: IconDirectionSign,
    name: 'Отданные',
  },
  {
    id: 5,
    Icon: IconArchive,
    name: 'Отмененные',
  },
];

const OrdersSidebar = () => {
  const activeSidebarIndex = useAppSelector(
    (state) => state.order.activeSidebarIndex
  );
  const sidebarIsOpen = useAppSelector((state) => state.order.sidebarIsOpen);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    dispatch(orderActions.setSidebarIsOpen(!sidebarIsOpen));
  };

  const itemChangeHandler = (item: ISidebarItem, index: number) => {
    const status: IStatus = {
      id: item.id,
      name: item.name,
      color: '',
    };
    dispatch(orderActions.setActiveStatus(status));
    dispatch(orderActions.setActiveSidebarIndex(index));
  };

  const addButton: ISidebarAddButton = {
    name: 'Новый заказ',
    onClick: () => navigate(ORDER_DETAIL_ROUTE),
  };

  return (
    <Sidebar
      isOpen={sidebarIsOpen}
      addButton={addButton}
      items={items}
      selectedItem={items[activeSidebarIndex]}
      toggle={toggleSidebar}
      onChange={itemChangeHandler}
    />
  );
};

export default OrdersSidebar;
