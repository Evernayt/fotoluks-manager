import { useAppDispatch } from 'hooks/redux';
import { IOrder } from 'models/api/IOrder';
import { Item, ItemParams } from 'react-contexify';
import { modalActions } from 'store/reducers/ModalSlice';
import 'react-contexify/ReactContexify.css';
import { ContextMenu } from 'components';
import { IconBuildingStore, IconInfoSquare } from '@tabler/icons-react';
import { CONTEXT_MENU_ICON_STYLE, ICON_SIZE, ICON_STROKE } from 'constants/app';

export const ORDERS_TABLE_MENU_ID = 'ORDERS_TABLE_MENU_ID';

const OrdersTableContextMenu = () => {
  const dispatch = useAppDispatch();

  const openOrderInfoModal = (params: ItemParams<IOrder>) => {
    const order = params.props;
    dispatch(
      modalActions.openModal({
        modal: 'ordersInfoModal',
        props: { order },
      })
    );
  };

  const openOrderShopModal = (params: ItemParams<IOrder>) => {
    const order = params.props;
    dispatch(
      modalActions.openModal({
        modal: 'ordersShopModal',
        props: { order },
      })
    );
  };

  return (
    <ContextMenu id={ORDERS_TABLE_MENU_ID}>
      <Item onClick={openOrderInfoModal}>
        <IconInfoSquare
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        О заказе
      </Item>
      <Item onClick={openOrderShopModal}>
        <IconBuildingStore
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Перемещение
      </Item>
    </ContextMenu>
  );
};

export default OrdersTableContextMenu;
