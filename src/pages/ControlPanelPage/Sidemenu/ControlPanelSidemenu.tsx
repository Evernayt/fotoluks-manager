import {
  IconBox,
  IconCategory,
  IconFeature,
  IconFriends,
  IconMug,
  IconParam,
  IconShop,
  IconUser,
} from 'icons';
import { useAppDispatch } from 'hooks/redux';
import { Sidemenu } from 'components';
import { useMemo } from 'react';
import { ISidemenuItem } from 'components/Sidemenu/Sidemenu.types';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

const ControlPanelSidemenu = () => {
  const dispatch = useAppDispatch();

  const items = useMemo<ISidemenuItem[]>(
    () => [
      {
        id: 1,
        Icon: IconUser,
        name: 'Сотрудники',
      },
      {
        id: 2,
        Icon: IconFriends,
        name: 'Клиенты',
      },
      {
        id: 3,
        Icon: IconMug,
        name: 'Товары',
      },
      {
        id: 4,
        Icon: IconBox,
        name: 'Продукты',
      },
      {
        id: 5,
        Icon: IconCategory,
        name: 'Категории',
      },
      {
        id: 6,
        Icon: IconFeature,
        name: 'Характеристики',
      },
      {
        id: 7,
        Icon: IconParam,
        name: 'Параметры',
      },
      {
        id: 8,
        Icon: IconShop,
        name: 'Филиалы',
      },
    ],
    []
  );

  const changeHandler = (item: ISidemenuItem) => {
    dispatch(controlPanelSlice.actions.setActiveTableId(item.id));
  };

  return (
    <Sidemenu
      items={items}
      defaultActiveItem={items[0]}
      onChange={changeHandler}
    />
  );
};

export default ControlPanelSidemenu;
