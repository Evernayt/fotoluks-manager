import { IconMove, IconShoppingCart } from 'icons';
import { useAppDispatch } from 'hooks/redux';
import { Sidemenu } from 'components';
import { useMemo } from 'react';
import { ISidemenuItem } from 'components/Sidemenu/Sidemenu.types';
import { moyskladSlice } from 'store/reducers/MoyskladSlice';

const MoyskladSidemenu = () => {
  const dispatch = useAppDispatch();

  const items = useMemo<ISidemenuItem[]>(
    () => [
      {
        id: 1,
        Icon: IconMove,
        name: 'Перемещение',
      },
      {
        id: 2,
        Icon: IconShoppingCart,
        name: 'Заканчивающиеся',
      },
    ],
    []
  );

  const changeHandler = (item: ISidemenuItem) => {
    dispatch(moyskladSlice.actions.setActiveTableId(item.id));
  };

  return (
    <Sidemenu
      items={items}
      defaultActiveItem={items[0]}
      onChange={changeHandler}
    />
  );
};

export default MoyskladSidemenu;
