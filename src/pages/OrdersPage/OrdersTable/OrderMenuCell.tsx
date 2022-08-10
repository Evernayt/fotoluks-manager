import { DropdownButton } from 'components';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch } from 'hooks/redux';
import { dotsMenuIcon } from 'icons';
import { IOrder } from 'models/IOrder';
import { Cell } from 'react-table';
import { modalSlice } from 'store/reducers/ModalSlice';

const OrderMenuCell = ({ row }: Cell<IOrder>) => {
  const dispatch = useAppDispatch();

  const openOrderInfoModal = () => {
    const orderId = row.values.id;
    dispatch(modalSlice.actions.openOrderInfoModal(orderId));
  };

  const openOrderShopModal = () => {
    const orderId = row.values.id;
    dispatch(modalSlice.actions.openOrderShopModal(orderId));
  };

  // const testCreate = () => {
  //   window.electron.ipcRenderer.once('create-folder', (result) => {
  //     // вы, вероятно, должны получить folderCreated
  //     console.log(result);
  //   });
  //   window.electron.ipcRenderer.sendMessage('create-folder', []);
  // };

  const orderMenu = [
    {
      name: 'О заказе',
      onClick: openOrderInfoModal,
    },
    {
      name: 'Перемещение',
      onClick: openOrderShopModal,
    },
  ];

  return (
    <DropdownButton
      options={orderMenu}
      placement={Placements.leftStart}
      icon={dotsMenuIcon}
      variant={DropdownButtonVariants.link}
    />
  );
};

export default OrderMenuCell;
