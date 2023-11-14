import ProductAPI from 'api/ProductAPI/ProductAPI';
import { useAppDispatch } from 'hooks/redux';
import { IProduct } from 'models/api/IProduct';
import { Menu, Item, ItemParams } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';

export const PRODUCTS_MENU_ID = 'PRODUCTS_MENU_ID';

const ProductsContextMenu = () => {
  const dispatch = useAppDispatch();

  const toggleArchive = (product: IProduct) => {
    ProductAPI.update({ id: product.id, archive: !product.archive }).then(
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
    <Menu id={PRODUCTS_MENU_ID}>
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

export default ProductsContextMenu;
