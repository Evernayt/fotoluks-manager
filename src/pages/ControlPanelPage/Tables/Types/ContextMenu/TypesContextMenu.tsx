import TypeAPI from 'api/TypeAPI/TypeAPI';
import { useAppDispatch } from 'hooks/redux';
import { IType } from 'models/api/IType';
import { Menu, Item, ItemParams } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

export const TYPES_MENU_ID = 'TYPES_MENU_ID';

const TypesContextMenu = () => {
  const dispatch = useAppDispatch();

  const toggleArchive = (type: IType) => {
    TypeAPI.update({ id: type.id, archive: !type.archive }).then(() => {
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
    <Menu id={TYPES_MENU_ID}>
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

export default TypesContextMenu;
