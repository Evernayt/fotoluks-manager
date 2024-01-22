import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import socketio from 'socket/socketio';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { modalActions } from 'store/reducers/ModalSlice';
import { orderActions } from 'store/reducers/OrderSlice';

interface OrderUnsavedDataModalProps {
  saveOrder: () => void;
}

const OrderUnsavedDataModal: FC<OrderUnsavedDataModalProps> = ({
  saveOrder,
}) => {
  const { isOpen } = useAppSelector(
    (state) => state.modal.orderUnsavedDataModal
  );
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const closeOrder = () => {
    closeModal();
    dispatch(orderActions.clearOrder());
    navigate(-1);

    if (employee) {
      socketio.removeWatcher(employee.id);
    }
  };

  const saveOrderAndClose = () => {
    saveOrder();
    closeOrder();
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('orderUnsavedDataModal'));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Сохранить изменения?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Есть не сохраненные данные.</Text>
        </ModalBody>
        <ModalFooter gap="var(--space-sm)">
          <Button onClick={closeModal}>Отмена</Button>
          <Button onClick={closeOrder}>Нет</Button>
          <Button colorScheme="yellow" onClick={saveOrderAndClose}>
            Да
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderUnsavedDataModal;
