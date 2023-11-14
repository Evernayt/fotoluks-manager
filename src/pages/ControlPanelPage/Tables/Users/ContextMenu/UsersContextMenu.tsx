import UserAPI from 'api/UserAPI/UserAPI';
import { useAppDispatch } from 'hooks/redux';
import { IUser } from 'models/api/IUser';
import { Menu, Item, ItemParams } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

export const USERS_MENU_ID = 'USERS_MENU_ID';

const UsersContextMenu = () => {
  const dispatch = useAppDispatch();

  const toggleArchive = (user: IUser) => {
    UserAPI.update({ id: user.id, archive: !user.archive }).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
    });
  };

  const handleItemClick = (params: ItemParams) => {
    toggleArchive(params.props.row.original);
  };

  const isHidden = (params: ItemParams) => {
    return params.props.row.original.archive;
  };

  return (
    <Menu id={USERS_MENU_ID}>
      <Item hidden={(e) => isHidden(e as ItemParams)} onClick={handleItemClick}>
        В архив
      </Item>
      <Item
        hidden={(e) => !isHidden(e as ItemParams)}
        onClick={handleItemClick}
      >
        Удалить из архива
      </Item>
    </Menu>
  );
};

export default UsersContextMenu;
