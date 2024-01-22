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
import { taskActions } from 'store/reducers/TaskSlice';

const TaskCancelModal = () => {
  const { isOpen } = useAppSelector((state) => state.modal.taskCancelModal);

  const dispatch = useAppDispatch();

  const cancel = () => {
    dispatch(taskActions.undoTask());
    closeModal();
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('taskCancelModal'));
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

export default TaskCancelModal;
