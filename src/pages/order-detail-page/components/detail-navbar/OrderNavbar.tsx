import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { orderActions } from 'store/reducers/OrderSlice';
import socketio from 'socket/socketio';
import { modalActions } from 'store/reducers/ModalSlice';
import { DetailNavbar, StatusSelect } from 'components';
import { IStatus } from 'models/api/IStatus';
import { FC } from 'react';
import { IconButton } from '@chakra-ui/react';
import { IconFiles } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';

interface OrderNavbarProps {
  isDisabled: boolean;
}

const OrderNavbar: FC<OrderNavbarProps> = ({ isDisabled }) => {
  const order = useAppSelector((state) => state.order.order);
  const haveUnsavedData = useAppSelector(
    (state) => state.order.haveUnsavedData
  );
  const employee = useAppSelector((state) => state.employee.employee);
  const openedOrderStatus = useAppSelector(
    (state) => state.order.openedOrderStatus
  );

  const isOrderCreated = order.id !== 0;
  const title = isOrderCreated ? `Заказ № ${order?.id}` : 'Новый заказ';

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const setOpenedOrderStatus = (status: IStatus) => {
    dispatch(orderActions.setOpenedOrderStatus(status));
  };

  const closeOrderDetail = () => {
    if (haveUnsavedData) {
      openUnsavedDataModal();
    } else {
      dispatch(orderActions.clearOrder());
      navigate(-1);

      if (!employee) return;
      socketio.removeOrderEditor(employee.id);
    }
  };

  const openUnsavedDataModal = () => {
    dispatch(modalActions.openModal({ modal: 'orderUnsavedDataModal' }));
  };

  const openOrderFilesModal = () => {
    dispatch(
      modalActions.openModal({
        modal: 'orderFilesModal',
        props: { orderProductId: null },
      })
    );
  };

  const centerSection = () => {
    return isOrderCreated ? (
      <StatusSelect
        selectedStatus={openedOrderStatus}
        order={order}
        onChange={setOpenedOrderStatus}
      />
    ) : null;
  };

  const rightSection = () => {
    return order.orderFiles && order.orderFiles.length > 0 ? (
      <IconButton
        icon={<IconFiles size={ICON_SIZE} stroke={ICON_STROKE} />}
        variant="ghost"
        aria-label="files"
        onClick={openOrderFilesModal}
      />
    ) : null;
  };

  return (
    <DetailNavbar
      title={title}
      isDisabled={isDisabled}
      centerSection={centerSection()}
      rightSection={rightSection()}
      onClose={closeOrderDetail}
    />
  );
};

export default OrderNavbar;
