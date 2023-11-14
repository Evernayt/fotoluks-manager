import {
  Icon123,
  IconCurrencyRubel,
  IconMove,
  IconReceiptRefund,
  IconShoppingCart,
} from 'icons';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { Sidemenu } from 'components';
import { useMemo } from 'react';
import { ISidemenuItem } from 'components/Sidemenu/Sidemenu.types';
import { moyskladSlice } from 'store/reducers/MoyskladSlice';

const MoyskladSidemenu = () => {
  const activeSidemenuIndex = useAppSelector(
    (state) => state.moysklad.activeSidemenuIndex
  );
  const sidemenuIsOpen = useAppSelector(
    (state) => state.moysklad.sidemenuIsOpen
  );

  const dispatch = useAppDispatch();

  const items = useMemo<ISidemenuItem[]>(
    () => [
      {
        id: 1,
        Icon: Icon123,
        name: 'Остатки',
      },
      {
        id: 2,
        Icon: IconMove,
        name: 'Перемещение',
      },
      {
        id: 3,
        Icon: IconShoppingCart,
        name: 'Заканчивающиеся',
      },
      {
        id: 4,
        Icon: IconCurrencyRubel,
        name: 'Обновить цены',
      },
      {
        id: 5,
        Icon: IconReceiptRefund,
        name: 'Брак',
      },
    ],
    []
  );

  const toggleSidemenu = () => {
    dispatch(moyskladSlice.actions.setSidemenuIsOpen(!sidemenuIsOpen));
  };

  const changeHandler = (_item: ISidemenuItem, index: number) => {
    dispatch(moyskladSlice.actions.setActiveSidemenuIndex(index));
  };

  return (
    <Sidemenu
      isOpen={sidemenuIsOpen}
      items={items}
      defaultActiveItem={items[activeSidemenuIndex]}
      toggle={toggleSidemenu}
      onChange={changeHandler}
    />
  );
};

export default MoyskladSidemenu;
