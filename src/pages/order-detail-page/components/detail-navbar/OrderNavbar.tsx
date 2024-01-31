import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { orderActions } from 'store/reducers/OrderSlice';
import socketio from 'socket/socketio';
import { modalActions } from 'store/reducers/ModalSlice';
import { DetailNavbar, StatusSelect } from 'components';
import { IStatus } from 'models/api/IStatus';

const OrderNavbar = () => {
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

  const centerSection = () => {
    return isOrderCreated ? (
      <StatusSelect
        selectedStatus={openedOrderStatus}
        order={order}
        onChange={setOpenedOrderStatus}
      />
    ) : null;
  };

  return (
    <DetailNavbar
      title={title}
      centerSection={centerSection()}
      onClose={closeOrderDetail}
    />
  );
};

export default OrderNavbar;
