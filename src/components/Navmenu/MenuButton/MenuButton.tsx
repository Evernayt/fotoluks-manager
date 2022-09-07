import DropdownButton, {
  IDropdownButtonOption,
} from 'components/UI/DropdownButton/DropdownButton';
import { LOGIN_ROUTE, SETTINGS_ROUTE } from 'constants/paths';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { dropIcon } from 'icons';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import socketio from 'socket/socketio';
import { appSlice } from 'store/reducers/AppSlice';
import { userSlice } from 'store/reducers/UserSlice';

const MenuButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    dispatch(userSlice.actions.signOut());
    navigate(LOGIN_ROUTE);
    socketio.disconnect();
  };

  const navigateToRoute = (route: string) => {
    dispatch(appSlice.actions.setActiveRoute(route));
    navigate(route);
  };

  const items = useMemo<IDropdownButtonOption[]>(
    () => [
      {
        id: 1,
        name: 'Настройки',
        onClick: () => navigateToRoute(SETTINGS_ROUTE),
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
      icon={dropIcon}
      circle
      options={items}
    />
  );
};

export default MenuButton;
