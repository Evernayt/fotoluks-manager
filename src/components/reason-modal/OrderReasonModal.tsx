import { useAppDispatch, useAppSelector } from 'hooks/redux';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { modalActions } from 'store/reducers/ModalSlice';
import { AutoResizableTextarea } from 'components';
import { useState } from 'react';
import OrderAPI from 'api/OrderAPI/OrderAPI';
import { orderActions } from 'store/reducers/OrderSlice';
import socketio from 'socket/socketio';
import { getEmployeeShortName } from 'helpers/employee';
import NotificationAPI from 'api/NotificationAPI/NotificationAPI';
import { APP_ID, NOTIF_CATEGORY_ID } from 'constants/app';

const OrderReasonModal = () => {
  const [text, setText] = useState<string>('');

  const { isOpen, status, order, updateOpenedOrderStatus } = useAppSelector(
    (state) => state.modal.ordersReasonModal
  );
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();

  const updateStatus = () => {
    if (!employee || !status || !order) return;

    OrderAPI.editStatus({
      description: text,
      orderId: order.id,
      statusId: status.id,
      employeeId: employee.id,
    }).then(() => {
      if (updateOpenedOrderStatus) {
        dispatch(orderActions.setOpenedOrderStatus(status));
      }

      notifyStatusChange();
      const updatedOrder = { ...order, status };
      dispatch(orderActions.updateOrder(updatedOrder));
      socketio.updateOrder(updatedOrder);
      closeModal();
    });
  };

  const notifyStatusChange = () => {
    if (!order?.orderMembers?.length || !status) return;

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

  const closeModal = () => {
    dispatch(modalActions.closeModal('ordersReasonModal'));
    setText('');
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Причина отмены заказа</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AutoResizableTextarea
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </ModalBody>
        <ModalFooter gap="var(--space-sm)">
          <Button w="100%" onClick={closeModal}>
            Отмена
          </Button>
          <Button
            colorScheme="yellow"
            w="100%"
            isDisabled={!text.length}
            onClick={updateStatus}
          >
            Изменить статус
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderReasonModal;
