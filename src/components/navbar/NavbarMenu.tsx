import {
  Avatar,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import {
  IconSettings,
  IconLogout,
  IconMoon,
  IconSun,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { LOGIN_ROUTE, PROFILE_ROUTE, SETTINGS_ROUTE } from 'constants/paths';
import { getEmployeeFullName } from 'helpers/employee';
import { setToken } from 'helpers/localStorage';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useLocation, useNavigate } from 'react-router-dom';
import socketio from 'socket/socketio';
import { appActions } from 'store/reducers/AppSlice';
import { controlActions } from 'store/reducers/ControlSlice';
import { employeeActions } from 'store/reducers/EmployeeSlice';
import { endingGoodsActions } from 'store/reducers/EndingGoodsSlice';
import { moveActions } from 'store/reducers/MoveSlice';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import { orderActions } from 'store/reducers/OrderSlice';
import { taskActions } from 'store/reducers/TaskSlice';

const NavbarMenu = () => {
  const employee = useAppSelector((state) => state.employee.employee);

  const { colorMode, toggleColorMode } = useColorMode();

  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const openProfilePage = () => {
    if (location.pathname === PROFILE_ROUTE) return;
    navigate(PROFILE_ROUTE);
  };

  const openSettingsPage = () => {
    if (location.pathname === SETTINGS_ROUTE) return;
    navigate(SETTINGS_ROUTE);
  };

  const signOut = () => {
    setToken('');
    dispatch(appActions.clearState());
    dispatch(employeeActions.clearState());
    dispatch(controlActions.clearState());
    dispatch(endingGoodsActions.clearState());
    dispatch(moyskladActions.clearState());
    dispatch(orderActions.clearState());
    dispatch(taskActions.clearState());
    dispatch(moveActions.clearState());
    navigate(LOGIN_ROUTE);
    socketio.disconnect();
  };

  return (
    <Menu autoSelect={false}>
      <MenuButton>
        <Avatar
          name={getEmployeeFullName(employee)}
          src={employee?.avatar || undefined}
          ignoreFallback
        />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={openProfilePage}>
          <Avatar
            name={getEmployeeFullName(employee)}
            src={employee?.avatar || undefined}
            h="35px"
            w="35px"
            mr="12px"
          />
          <Text>{getEmployeeFullName(employee)}</Text>
        </MenuItem>
        <MenuDivider />
        <MenuItem
          icon={<IconSettings size={ICON_SIZE} stroke={ICON_STROKE} />}
          onClick={openSettingsPage}
        >
          Настройки
        </MenuItem>
        <MenuItem
          icon={
            colorMode === 'light' ? (
              <IconSun size={ICON_SIZE} stroke={ICON_STROKE} />
            ) : (
              <IconMoon size={ICON_SIZE} stroke={ICON_STROKE} />
            )
          }
          onClick={toggleColorMode}
        >
          {colorMode === 'light' ? 'Тема: Светлая' : 'Тема: Темная'}
        </MenuItem>
        <MenuItem
          icon={
            <IconLogout
              size={ICON_SIZE}
              stroke={ICON_STROKE}
              style={{ marginLeft: '2px' }}
            />
          }
          onClick={signOut}
        >
          Выйти из аккаунта
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default NavbarMenu;
