import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { ITaskSubtask } from 'models/api/ITaskSubtask';
import { v4 as uuidv4 } from 'uuid';
import { taskActions } from 'store/reducers/TaskSlice';
import { modalActions } from 'store/reducers/ModalSlice';
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
import TaskSubtaskItem from './subtask-item/TaskSubtaskItem';
import { IconListCheck } from '@tabler/icons-react';
import styles from './TaskSubtasksModal.module.scss';

const TaskSubtasksModal = () => {
  const { isOpen } = useAppSelector((state) => state.modal.taskSubtasksModal);
  const task = useAppSelector((state) => state.task.task);

  const dispatch = useAppDispatch();

  const createSubtask = () => {
    const createdSubtask: ITaskSubtask = {
      id: uuidv4(),
      text: '',
      completed: false,
    };
    dispatch(taskActions.addTaskSubtask(createdSubtask));
    dispatch(taskActions.addTaskSubtaskForCreate(createdSubtask));
  };

  const deleteSubTaskHandler = (id: number | string) => {
    dispatch(taskActions.deleteTaskSubtask(id));
    if (typeof id === 'number') {
      dispatch(taskActions.addTaskSubtaskIdForDelete(id));
    }
  };

  const changeTextHandler = (id: number | string, text: string) => {
    dispatch(taskActions.editTaskSubtaskById({ id, text }));
    if (typeof id === 'string') {
      dispatch(taskActions.editTaskSubtaskForCreate({ id, text }));
    } else if (typeof id === 'number') {
      dispatch(taskActions.editTaskSubtaskForUpdate({ id, text }));
    }
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('taskSubtasksModal'));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Подзадачи</ModalHeader>
        <ModalCloseButton />
        <ModalBody className={styles.container}>
          {task.taskSubtasks?.length ? (
            <div className={styles.subtasks}>
              {task.taskSubtasks.map((taskSubtask) => (
                <TaskSubtaskItem
                  taskSubtask={taskSubtask}
                  onChange={changeTextHandler}
                  onDelete={deleteSubTaskHandler}
                  key={taskSubtask.id}
                />
              ))}
            </div>
          ) : (
            <div className={styles.no_subtasks}>
              <IconListCheck className="link-icon" size={48} stroke={1.1} />
              <Text variant="secondary">Нет подзадач</Text>
            </div>
          )}
        </ModalBody>
        <ModalFooter gap="var(--space-sm)">
          <Button w="100%" onClick={closeModal}>
            Подтвердить
          </Button>
          <Button colorScheme="yellow" w="100%" onClick={createSubtask}>
            Добавить подзадачу
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskSubtasksModal;
