import ParamAPI from 'api/ParamAPI/ParamAPI';
import { useAppDispatch } from 'hooks/redux';
import { IParam } from 'models/api/IParam';
import { Menu, Item, ItemParams } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

export const PARAMS_MENU_ID = 'PARAMS_MENU_ID';

const ParamsContextMenu = () => {
  const dispatch = useAppDispatch();

  const toggleArchive = (param: IParam) => {
    ParamAPI.update({ id: param.id, archive: !param.archive }).then(() => {
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
    <Menu id={PARAMS_MENU_ID}>
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

export default ParamsContextMenu;
