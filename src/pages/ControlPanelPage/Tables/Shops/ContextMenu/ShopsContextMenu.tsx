import ShopAPI from 'api/ShopAPI/ShopAPI';
import { useAppDispatch } from 'hooks/redux';
import { IShop } from 'models/api/IShop';
import { Menu, Item, ItemParams } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

export const SHOPS_MENU_ID = 'SHOPS_MENU_ID';

const ShopsContextMenu = () => {
  const dispatch = useAppDispatch();

  const toggleArchive = (shop: IShop) => {
    ShopAPI.update({ id: shop.id, archive: !shop.archive }).then(() => {
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
    <Menu id={SHOPS_MENU_ID}>
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

export default ShopsContextMenu;
