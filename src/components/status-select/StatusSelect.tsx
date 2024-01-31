import { FC } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  useDisclosure,
  Badge,
  PopoverContentProps,
} from '@chakra-ui/react';
import { IStatus } from 'models/api/IStatus';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IOrder } from 'models/api/IOrder';
import OrderAPI from 'api/OrderAPI/OrderAPI';
import { orderActions } from 'store/reducers/OrderSlice';
import socketio from 'socket/socketio';
import { getEmployeeShortName } from 'helpers/employee';
import NotificationAPI from 'api/NotificationAPI/NotificationAPI';
import { APP_ID, NOTIF_CATEGORY_ID } from 'constants/app';
import { modalActions } from 'store/reducers/ModalSlice';
import styles from './StatusSelect.module.scss';

interface StatusSelectProps {
  selectedStatus: IStatus | undefined | null;
  order: IOrder;
  isOpenedOrderStatusSelect?: boolean;
  containerClassName?: string;
  popoverContentProps?: PopoverContentProps;
  onChange?: (status: IStatus) => void;
}

const StatusSelect: FC<StatusSelectProps> = ({
  selectedStatus,
  order,
  isOpenedOrderStatusSelect,
  containerClassName,
  popoverContentProps,
  onChange,
}) => {
  const statuses = useAppSelector((state) => state.order.statuses);
  const employee = useAppSelector((state) => state.employee.employee);

  const { onOpen, onClose, isOpen } = useDisclosure();

  const dispatch = useAppDispatch();

  const statusChangeHandler = (status: IStatus) => {
    onClose();

    if (status.name === 'Отменен') {
      openOrderReasonModal(status);
      return;
    }

    updateStatus(status);
    if (onChange) onChange(status);
  };

  const updateStatus = (status: IStatus) => {
    if (!employee) return;

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
  };

  const notifyStatusChange = (order: IOrder, status: IStatus) => {
    if (!order.orderMembers?.length) return;

    const employeeIds: number[] = [];
    order.orderMembers.forEach((orderMember) => {
      employeeIds.push(orderMember.employee.id);
    });

    const oldStatusName = order.status?.name;
    const title = 'Изменен статус';
    const text = `${getEmployeeShortName(employee)} изменил статус заказа № ${
      order.id
    } c "${oldStatusName}" на "${status.name}"`;

    NotificationAPI.create({
      title,
      text,
      employeeIds,
      appId: APP_ID.Заказы,
      notificationCategoryId: NOTIF_CATEGORY_ID.Изменен_статус_заказа,
    }).then((data) => {
      socketio.sendNotification(data, employeeIds);
    });
  };

  const openOrderReasonModal = (status: IStatus) => {
    dispatch(
      modalActions.openModal({
        modal: 'ordersReasonModal',
        props: {
          status,
          order,
          updateOpenedOrderStatus: isOpenedOrderStatusSelect,
        },
      })
    );
  };

  return (
    <Popover isOpen={isOpen} isLazy onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <div className={containerClassName}>
          <Badge colorScheme={selectedStatus?.color} as="button" w="100%">
            {selectedStatus?.name}
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent w="max-content" {...popoverContentProps}>
        <PopoverArrow />
        <PopoverBody p={2}>
          {statuses.map((status) => {
            const isSelected = status.id === selectedStatus?.id;
            return (
              <div
                className={[
                  styles.item,
                  isSelected && styles.selected_item,
                ].join(' ')}
                onClick={() => statusChangeHandler(status)}
                key={status.id}
              >
                {status.name}
              </div>
            );
          })}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default StatusSelect;
