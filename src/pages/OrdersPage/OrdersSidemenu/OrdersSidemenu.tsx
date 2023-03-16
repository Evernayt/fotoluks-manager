import {
  IconAllOrders,
  IconCanceledOrders,
  IconGivenOrders,
  IconInWorkOrders,
  IconNewOrders,
  IconReadyOrders,
} from 'icons';
import { useNavigate } from 'react-router-dom';
import { ORDER_DETAIL_ROUTE } from 'constants/paths';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { orderSlice } from 'store/reducers/OrderSlice';
import { Sidemenu } from 'components';
import { useMemo } from 'react';
import {
  ISidemenuAddButton,
  ISidemenuItem,
} from 'components/Sidemenu/Sidemenu.types';
import { IStatus } from 'models/api/IStatus';

const OrdersSidemenu = () => {
  const activeSidemenuIndex = useAppSelector(
    (state) => state.order.activeSidemenuIndex
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const items = useMemo<ISidemenuItem[]>(
    () => [
      {
        id: 0,
        Icon: IconAllOrders,
        name: 'Все заказы',
      },
      {
        id: 1,
        Icon: IconNewOrders,
        name: 'Новые',
      },
      {
        id: 2,
        Icon: IconInWorkOrders,
        name: 'В работе',
      },
      {
        id: 3,
        Icon: IconReadyOrders,
        name: 'Готовые',
      },
      {
        id: 4,
        Icon: IconGivenOrders,
        name: 'Отданные',
      },
      {
        id: 5,
        Icon: IconCanceledOrders,
        name: 'Отмененные',
      },
    ],
    []
  );

  const changeHandler = (item: ISidemenuItem, index: number) => {
    const status: IStatus = {
      id: item.id,
      name: item.name,
      color: '',
    };
    dispatch(orderSlice.actions.setActiveStatus(status));
    dispatch(orderSlice.actions.setActiveSidemenuIndex(index));
  };

  const addButton: ISidemenuAddButton = {
    text: 'Новый заказ',
    onClick: () => navigate(ORDER_DETAIL_ROUTE),
  };

  return (
    <Sidemenu
      addButton={addButton}
      items={items}
      defaultActiveItem={items[activeSidemenuIndex]}
      onChange={changeHandler}
    />
  );
};

export default OrdersSidemenu;
