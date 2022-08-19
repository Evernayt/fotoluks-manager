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
    const order = row.original;
    dispatch(modalSlice.actions.openOrderInfoModal(order));
  };

  const openOrderShopModal = () => {
    const order = row.original;
    dispatch(modalSlice.actions.openOrderShopModal(order));
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
      icon={dotsMenuIcon}
      variant={DropdownButtonVariants.link}
    />
  );
};

export default OrderMenuCell;
