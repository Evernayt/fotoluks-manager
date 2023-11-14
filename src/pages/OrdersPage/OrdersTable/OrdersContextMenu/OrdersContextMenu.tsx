import { useAppDispatch } from 'hooks/redux';
import { IOrder } from 'models/api/IOrder';
import { Menu, Item, ItemParams } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { modalSlice } from 'store/reducers/ModalSlice';

export const ORDERS_MENU_ID = 'ORDERS_MENU_ID';

const OrdersContextMenu = () => {
  const dispatch = useAppDispatch();

  const openOrderInfoModal = (order: IOrder) => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'orderInfoModal',
        props: { order },
      })
    );
  };

  const openOrderShopModal = (order: IOrder) => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'orderShopModal',
        props: { order },
      })
    );
  };

  const handleItemClick = (params: ItemParams) => {
    switch (params.id) {
      case 'orderInfo':
        openOrderInfoModal(params.props.row.original);
        break;
      case 'orderShop':
        openOrderShopModal(params.props.row.original);
        break;
      default:
        break;
    }
  };

  return (
    <Menu id={ORDERS_MENU_ID}>
      <Item id="orderInfo" onClick={handleItemClick}>
        О заказе
      </Item>
      <Item id="orderShop" onClick={handleItemClick}>
        Перемещение
      </Item>
    </Menu>
  );
};

export default OrdersContextMenu;
