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
  Text,
} from '@chakra-ui/react';
import { modalActions } from 'store/reducers/ModalSlice';
import { orderActions } from 'store/reducers/OrderSlice';

const OrderCancelModal = () => {
  const { isOpen } = useAppSelector((state) => state.modal.orderCancelModal);

  const dispatch = useAppDispatch();

  const cancel = () => {
    dispatch(orderActions.undoOrder());
    closeModal();
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('orderCancelModal'));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Отменить изменения?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Все не сохраненные данные будут удалены.</Text>
        </ModalBody>
        <ModalFooter gap="var(--space-sm)">
          <Button onClick={closeModal}>Нет</Button>
          <Button colorScheme="yellow" onClick={cancel}>
            Да
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderCancelModal;
