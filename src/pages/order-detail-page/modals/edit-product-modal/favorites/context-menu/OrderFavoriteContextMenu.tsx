import { Item, ItemParams } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { IconStarOff } from '@tabler/icons-react';
import { useAppDispatch } from 'hooks/redux';
import FavoriteAPI from 'api/FavoriteAPI/FavoriteAPI';
import { ContextMenu } from 'components';
import { CONTEXT_MENU_ICON_STYLE, ICON_SIZE, ICON_STROKE } from 'constants/app';
import { IFavorite } from 'models/api/IFavorite';
import { orderActions } from 'store/reducers/OrderSlice';
import { useToast } from '@chakra-ui/react';
import { getErrorToast } from 'helpers/toast';

export const ORDER_FAVORITE_MENU_ID = 'ORDER_FAVORITE_MENU_ID';

const OrderFavoriteContextMenu = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const deleteFavorite = (params: ItemParams<IFavorite>) => {
    const product = params.props?.product;
    if (!product) return;
    FavoriteAPI.delete({ productId: product.id })
      .then(() => {
        dispatch(orderActions.deleteFavoriteByProductId(product.id));
      })
      .catch((e) =>
        toast(getErrorToast('OrderFavoriteContextMenu.deleteFavorite', e))
      );
  };

  return (
    <ContextMenu id={ORDER_FAVORITE_MENU_ID}>
      <Item onClick={deleteFavorite}>
        <IconStarOff
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Убрать из избранного
      </Item>
    </ContextMenu>
  );
};

export default OrderFavoriteContextMenu;
