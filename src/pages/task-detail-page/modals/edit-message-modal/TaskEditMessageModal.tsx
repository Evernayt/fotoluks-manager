import { useAppDispatch, useAppSelector } from 'hooks/redux';
import TaskMessageAPI from 'api/TaskMessageAPI/TaskMessageAPI';
import { ITaskMessage } from 'models/api/ITaskMessage';
import { modalActions } from 'store/reducers/ModalSlice';
import { taskActions } from 'store/reducers/TaskSlice';
import {
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import TaskCommentItemRight from 'pages/task-detail-page/components/comments/comment-item/TaskCommentItemRight';
import { MessageInput } from 'components';
import { IconPencil } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import styles from './TaskEditMessageModal.module.scss';

const TaskEditMessageModal = () => {
  const [text, setText] = useState<string>('');

  const { isOpen, taskMessage } = useAppSelector(
    (state) => state.modal.taskEditMessageModal
  );
  const taskMessages = useAppSelector((state) => state.task.taskMessages);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      setText(taskMessage?.message || '');
    }
  }, [isOpen]);

  const closeModal = () => {
    dispatch(modalActions.closeModal('taskEditMessageModal'));
  };

  const editMessage = () => {
    if (!taskMessage) return;
    const updatedTaskMessage: ITaskMessage = {
      ...taskMessage,
      message: text,
      edited: true,
    };
    TaskMessageAPI.update(updatedTaskMessage).then(() => {
      const updatedTaskMessages: ITaskMessage[] = taskMessages.map((x) =>
        x.id === updatedTaskMessage.id ? updatedTaskMessage : x
      );
      dispatch(taskActions.setTaskMessages(updatedTaskMessages));
      closeModal();
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Изменить комментарий</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text className={styles.caution}>
            Комментарий в уведомлених не будет изменен
          </Text>
        </ModalBody>
        <div className={styles.message_container}>
          <TaskCommentItemRight
            className={styles.message}
            taskMessage={taskMessage!}
          />
        </div>
        <Divider />
        <div className={styles.message_input}>
          <MessageInput
            value={text}
            icon={<IconPencil className={'link-icon'} />}
            onButtonClick={editMessage}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </ModalContent>
    </Modal>
  );
};

export default TaskEditMessageModal;
