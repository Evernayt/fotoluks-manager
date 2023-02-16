import { DropdownButton } from 'components';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { IconDotsMenu } from 'icons';
import { IOrder } from 'models/api/IOrder';
import { Cell } from 'react-table';
import { modalSlice } from 'store/reducers/ModalSlice';

const OrderMenuCell = ({ row }: Cell<IOrder>) => {
  const dispatch = useAppDispatch();

  const openOrderInfoModal = () => {
    const order = row.original;
    dispatch(
      modalSlice.actions.openModal({
        modal: 'orderInfoModal',
        props: { order },
      })
    );
  };

  const openOrderShopModal = () => {
    const order = row.original;
    dispatch(
      modalSlice.actions.openModal({
        modal: 'orderShopModal',
        props: { order },
      })
    );
  };

  const orderMenu = [
    {
      id: 1,
      name: 'О заказе',
      onClick: openOrderInfoModal,
    },
    {
      id: 2,
      name: 'Перемещение',
      onClick: openOrderShopModal,
    },
  ];

  return (
    <DropdownButton
      options={orderMenu}
      placement={Placements.leftStart}
      icon={<IconDotsMenu className="link-icon" />}
      variant={DropdownButtonVariants.link}
    />
  );
};

export default OrderMenuCell;
