import { IconMove } from 'icons';
import { useAppDispatch } from 'hooks/redux';
import { Sidemenu } from 'components';
import { useMemo } from 'react';
import { ISidemenuItem } from 'components/Sidemenu/Sidemenu.types';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

const MoyskladSidemenu = () => {
  const dispatch = useAppDispatch();

  const items = useMemo<ISidemenuItem[]>(
    () => [
      {
        id: 1,
        Icon: IconMove,
        name: 'Перемещение',
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

export default MoyskladSidemenu;
