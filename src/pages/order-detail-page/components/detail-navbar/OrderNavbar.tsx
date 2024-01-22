import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { orderActions } from 'store/reducers/OrderSlice';
import socketio from 'socket/socketio';
import { modalActions } from 'store/reducers/ModalSlice';
import { DetailNavbar } from 'components';
import OrderWatchers from './watchers/OrderWatchers';

const OrderNavbar = () => {
  const order = useAppSelector((state) => state.order.order);
  const haveUnsavedData = useAppSelector(
    (state) => state.order.haveUnsavedData
  );
  const employee = useAppSelector((state) => state.employee.employee);

  const title = order.id === 0 ? 'Новый заказ' : `Заказ № ${order?.id}`;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const closeOrderDetail = () => {
    if (haveUnsavedData) {
      openUnsavedDataModal();
    } else {
      dispatch(orderActions.clearOrder());
      navigate(-1);

      if (employee) {
        socketio.removeWatcher(employee.id);
      }
    }
  };

  const openUnsavedDataModal = () => {
    dispatch(modalActions.openModal({ modal: 'orderUnsavedDataModal' }));
  };

  const rightSection = () => {
    return <OrderWatchers orderId={order.id} employeeId={employee?.id || 0} />;
  };

  return (
    <DetailNavbar
      title={title}
      rightSection={rightSection()}
      onClose={closeOrderDetail}
    />
  );
};

export default OrderNavbar;
