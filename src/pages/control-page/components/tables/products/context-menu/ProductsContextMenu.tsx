import ProductAPI from 'api/ProductAPI/ProductAPI';
import { useAppDispatch } from 'hooks/redux';
import { IProduct } from 'models/api/IProduct';
import { Item, ItemParams } from 'react-contexify';
import { controlActions } from 'store/reducers/ControlSlice';
import { ContextMenu } from 'components';
import 'react-contexify/ReactContexify.css';
import { IconArchive } from '@tabler/icons-react';
import { CONTEXT_MENU_ICON_STYLE, ICON_SIZE, ICON_STROKE } from 'constants/app';

export const PRODUCTS_MENU_ID = 'PRODUCTS_MENU_ID';

const ProductsContextMenu = () => {
  const dispatch = useAppDispatch();

  const toggleArchive = (params: ItemParams<IProduct>) => {
    const product = params.props;
    if (!product) return;
    ProductAPI.update({ id: product.id, archive: !product.archive }).then(
      () => {
        dispatch(controlActions.setForceUpdate(true));
      }
    );
  };

  const isHidden = (params: ItemParams<IProduct>) => {
    return params.props?.archive || false;
  };

  return (
    <ContextMenu id={PRODUCTS_MENU_ID}>
      <Item hidden={(e) => isHidden(e as ItemParams)} onClick={toggleArchive}>
        <IconArchive
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        В архив
      </Item>
      <Item hidden={(e) => !isHidden(e as ItemParams)} onClick={toggleArchive}>
        <IconArchive
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Удалить из архива
      </Item>
    </ContextMenu>
  );
};

export default ProductsContextMenu;
