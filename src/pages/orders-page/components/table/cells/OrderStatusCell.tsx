import NotificationAPI from 'api/NotificationAPI/NotificationAPI';
import OrderAPI from 'api/OrderAPI/OrderAPI';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IOrder } from 'models/api/IOrder';
import { IStatus } from 'models/api/IStatus';
import { FC } from 'react';
import socketio from 'socket/socketio';
import { orderActions } from 'store/reducers/OrderSlice';
import { StatusSelect } from 'components';
import { Row } from '@tanstack/react-table';
import { getEmployeeFullName } from 'helpers/employee';

interface OrderStatusCellProps {
  row: Row<IOrder>;
}

const OrderStatusCell: FC<OrderStatusCellProps> = ({ row }) => {
  const employee = useAppSelector((state) => state.employee.employee);
  const statuses = useAppSelector((state) => state.order.statuses);

  const dispatch = useAppDispatch();

  const updateStatus = (status: IStatus) => {
    if (employee) {
      const order = row.original;
      OrderAPI.editStatus({
        orderId: order.id,
        statusId: status.id,
        employeeId: employee.id,
      }).then(() => {
        notifyStatusChange(order, status);
        const updatedOrder = { ...order, status };
        dispatch(orderActions.updateOrder(updatedOrder));
        socketio.updateOrder(updatedOrder);
      });
    }
  };

  const notifyStatusChange = (order: IOrder, status: IStatus) => {
    if (!order.orderMembers?.length) return;

    const employeeIds: number[] = [];
    order.orderMembers.forEach((orderMember) => {
      employeeIds.push(orderMember.employee.id);
    });

    const oldStatusName = order.status?.name;
    const title = 'Изменен статус';
    const text = `${getEmployeeFullName(employee)} изменил статус заказа № ${
      order.id
    } c "${oldStatusName}" на "${status.name}"`;

    NotificationAPI.create({
      title,
      text,
      employeeIds,
      appId: 1,
      notificationCategoryId: 4,
    }).then((data) => {
      socketio.sendNotification(data, employeeIds);
    });
  };

  return (
    <div className="cell_padding">
      <StatusSelect
        statuses={statuses}
        selectedStatus={row.original.status!}
        onChange={updateStatus}
      />
    </div>
  );
};

export default OrderStatusCell;
