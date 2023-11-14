import CategoryAPI from 'api/CategoryAPI/CategoryAPI';
import { useAppDispatch } from 'hooks/redux';
import { ICategory } from 'models/api/ICategory';
import { Menu, Item, ItemParams } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

export const CATEGORIES_MENU_ID = 'CATEGORIES_MENU_ID';

const CategoriesContextMenu = () => {
  const dispatch = useAppDispatch();

  const toggleArchive = (category: ICategory) => {
    CategoryAPI.update({ id: category.id, archive: !category.archive }).then(
      () => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
      }
    );
  };

  const handleItemClick = (params: ItemParams) => {
    toggleArchive(params.props.row.original);
  };

  const isHidden = (params: ItemParams) => {
    return params.props.row.original.archive;
  };

  return (
    <Menu id={CATEGORIES_MENU_ID}>
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

export default CategoriesContextMenu;
