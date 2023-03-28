import { IconCurrencyRubel, IconMove, IconShoppingCart } from 'icons';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { Sidemenu } from 'components';
import { useMemo } from 'react';
import { ISidemenuItem } from 'components/Sidemenu/Sidemenu.types';
import { moyskladSlice } from 'store/reducers/MoyskladSlice';

const MoyskladSidemenu = () => {
  const activeSidemenuIndex = useAppSelector(
    (state) => state.moysklad.activeSidemenuIndex
  );

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
      {
        id: 3,
        Icon: IconCurrencyRubel,
        name: 'Обновить цены',
      },
    ],
    []
  );

  const changeHandler = (_item: ISidemenuItem, index: number) => {
    dispatch(moyskladSlice.actions.setActiveSidemenuIndex(index));
  };

  return (
    <Sidemenu
      items={items}
      defaultActiveItem={items[activeSidemenuIndex]}
      onChange={changeHandler}
    />
  );
};

export default MoyskladSidemenu;
