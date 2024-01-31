import { useAppDispatch } from 'hooks/redux';
import { Item, ItemParams } from 'react-contexify';
import { controlActions } from 'store/reducers/ControlSlice';
import { ContextMenu } from 'components';
import { IShop } from 'models/api/IShop';
import ShopAPI from 'api/ShopAPI/ShopAPI';
import 'react-contexify/ReactContexify.css';
import { IconArchive, IconArchiveOff } from '@tabler/icons-react';
import { CONTEXT_MENU_ICON_STYLE, ICON_SIZE, ICON_STROKE } from 'constants/app';

export const SHOPS_MENU_ID = 'SHOPS_MENU_ID';

const ShopsContextMenu = () => {
  const dispatch = useAppDispatch();

  const toggleArchive = (params: ItemParams<IShop>) => {
    const shop = params.props;
    if (!shop) return;
    ShopAPI.update({ id: shop.id, archive: !shop.archive }).then(() => {
      dispatch(controlActions.setForceUpdate(true));
    });
  };

  const isHidden = (params: ItemParams<IShop>) => {
    return params.props?.archive || false;
  };

  return (
    <ContextMenu id={SHOPS_MENU_ID}>
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

export default ShopsContextMenu;
