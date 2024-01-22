import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { FC } from 'react';
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

interface TaskUnsavedDataModalProps {
  saveTask: () => void;
  closeTaskDetail: () => void;
}

const TaskUnsavedDataModal: FC<TaskUnsavedDataModalProps> = ({
  saveTask,
  closeTaskDetail,
}) => {
  const { isOpen } = useAppSelector(
    (state) => state.modal.taskUnsavedDataModal
  );

  const dispatch = useAppDispatch();

  const closeTask = () => {
    closeModal();
    closeTaskDetail();
  };

  const saveTaskAndClose = () => {
    saveTask();
    closeTask();
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('taskUnsavedDataModal'));
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
          <Button onClick={closeTask}>Нет</Button>
          <Button colorScheme="yellow" onClick={saveTaskAndClose}>
            Да
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskUnsavedDataModal;
