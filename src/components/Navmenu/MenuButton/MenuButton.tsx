import DropdownButton, {
  IDropdownButtonOption,
} from 'components/UI/DropdownButton/DropdownButton';
import { LOGIN_ROUTE, SETTINGS_ROUTE } from 'constants/paths';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { IconDrop } from 'icons';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import socketio from 'socket/socketio';
import { appSlice } from 'store/reducers/AppSlice';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { employeeSlice } from 'store/reducers/EmployeeSlice';
import { endingGoodsSlice } from 'store/reducers/EndingGoodsSlice';
import { moveSlice } from 'store/reducers/MoveSlice';
import { moyskladSlice } from 'store/reducers/MoyskladSlice';
import { orderSlice } from 'store/reducers/OrderSlice';
import { taskSlice } from 'store/reducers/TaskSlice';

const MenuButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    dispatch(employeeSlice.actions.clearState());
    dispatch(appSlice.actions.clearState());
    dispatch(controlPanelSlice.actions.clearState());
    dispatch(endingGoodsSlice.actions.clearState());
    dispatch(moveSlice.actions.clearState());
    dispatch(moyskladSlice.actions.clearState());
    dispatch(orderSlice.actions.clearState());
    dispatch(taskSlice.actions.clearState());
    navigate(LOGIN_ROUTE);
    socketio.disconnect();
  };

  const items = useMemo<IDropdownButtonOption[]>(
    () => [
      {
        id: 1,
        name: 'Настройки',
        onClick: () => navigate(SETTINGS_ROUTE),
      },
      {
        id: 2,
        name: 'Выйти из аккаунта',
        onClick: signOut,
      },
    ],
    []
  );

  return (
    <DropdownButton
      placement={Placements.bottomEnd}
      icon={<IconDrop className="secondary-icon" size={20} />}
      circle
      options={items}
    />
  );
};

export default MenuButton;
