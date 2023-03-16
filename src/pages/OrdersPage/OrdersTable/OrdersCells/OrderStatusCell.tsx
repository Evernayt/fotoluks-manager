import NotificationAPI from 'api/NotificationAPI/NotificationAPI';
import OrderAPI from 'api/OrderAPI/OrderAPI';
import { StatusSelectButton } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IOrder } from 'models/api/IOrder';
import { IStatus } from 'models/api/IStatus';
import { FC } from 'react';
import { Cell } from 'react-table';
import socketio from 'socket/socketio';
import { orderSlice } from 'store/reducers/OrderSlice';

interface OrderStatusCellProps {
  statuses: IStatus[];
  cell: Cell<IOrder>;
}

const OrderStatusCell: FC<OrderStatusCellProps> = ({ statuses, cell }) => {
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();

  const updateStatus = (status: IStatus, order: IOrder) => {
    if (employee) {
      OrderAPI.editStatus({
        orderId: order.id,
        statusId: status.id,
        employeeId: employee.id,
      }).then(() => {
        notifyStatusChange(order, status);
        const updatedOrder = { ...order, status };
        socketio.updateOrder(updatedOrder);
      });
    }
  };

  const notifyStatusChange = (order: IOrder, status: IStatus) => {
    if (!order.orderMembers?.length) return;

    const employeeIds = [];
    for (let i = 0; i < order.orderMembers.length; i++) {
      employeeIds.push(order.orderMembers[i].employee.id);
    }

    const updatedOrder = { ...order, status };
    dispatch(orderSlice.actions.updateOrder(updatedOrder));

    const oldStatusName = order.status?.name;
    const title = 'Изменен статус';
    const text = `${employee?.name} изменил статус заказа № ${order.id} c "${oldStatusName}" на "${status.name}"`;

    NotificationAPI.create({ title, text, employeeIds, appId: 1 }).then(
      (data) => {
        socketio.sendNotification(data);
      }
    );
  };

  return (
    <StatusSelectButton
      statuses={statuses}
      defaultSelectedStatus={cell.value}
      order={cell.row.original}
      onChange={updateStatus}
    />
  );
};

export default OrderStatusCell;
