import { useAppDispatch } from 'hooks/redux';
import { Item, ItemParams } from 'react-contexify';
import { controlActions } from 'store/reducers/ControlSlice';
import { ContextMenu } from 'components';
import { IUser } from 'models/api/IUser';
import UserAPI from 'api/UserAPI/UserAPI';
import 'react-contexify/ReactContexify.css';
import { IconArchive, IconArchiveOff } from '@tabler/icons-react';
import { CONTEXT_MENU_ICON_STYLE, ICON_SIZE, ICON_STROKE } from 'constants/app';

export const USERS_MENU_ID = 'USERS_MENU_ID';

const UsersContextMenu = () => {
  const dispatch = useAppDispatch();

  const toggleArchive = (params: ItemParams<IUser>) => {
    const user = params.props;
    if (!user) return;
    UserAPI.update({ id: user.id, archive: !user.archive }).then(() => {
      dispatch(controlActions.setForceUpdate(true));
    });
  };

  const isHidden = (params: ItemParams<IUser>) => {
    return params.props?.archive || false;
  };

  return (
    <ContextMenu id={USERS_MENU_ID}>
      <Item hidden={(e) => isHidden(e as ItemParams)} onClick={toggleArchive}>
        <IconArchive
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Добавить в архив
      </Item>
      <Item hidden={(e) => !isHidden(e as ItemParams)} onClick={toggleArchive}>
        <IconArchiveOff
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Убрать из архива
      </Item>
    </ContextMenu>
  );
};

export default UsersContextMenu;
