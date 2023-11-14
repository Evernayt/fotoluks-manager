import { MessageTextbox, Modal } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import TaskDetailCommentItemRight from 'pages/TasksDetailPage/Comments/CommentItem/TaskDetailCommentItemRight';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './TaskDetailEditMessageModal.module.scss';
import { IconEdit } from 'icons';
import TaskMessageAPI from 'api/TaskMessageAPI/TaskMessageAPI';
import { onButtonClickProps } from 'components/UI/MessageTextbox/MessageTextbox';
import { ITaskMessage } from 'models/api/ITaskMessage';
import { taskSlice } from 'store/reducers/TaskSlice';

const TaskDetailEditMessageModal = () => {
  const taskEditMessageModal = useAppSelector(
    (state) => state.modal.taskEditMessageModal
  );
  const taskMessages = useAppSelector((state) => state.task.taskMessages);

  const dispatch = useAppDispatch();

  const close = () => {
    dispatch(modalSlice.actions.closeModal('taskEditMessageModal'));
  };

  const editMessage = ({ text }: onButtonClickProps) => {
    if (!taskEditMessageModal.taskMessage) return;
    const updatedTaskMessage: ITaskMessage = {
      ...taskEditMessageModal.taskMessage,
      message: text,
      edited: true,
    };
    TaskMessageAPI.update(updatedTaskMessage).then(() => {
      const updatedTaskMessages: ITaskMessage[] = taskMessages.map((x) =>
        x.id === updatedTaskMessage.id ? updatedTaskMessage : x
      );
      dispatch(taskSlice.actions.setTaskMessages(updatedTaskMessages));
      close();
    });
  };

  return (
    <Modal
      title="Изменить комментарий"
      isShowing={taskEditMessageModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <div className={styles.caution}>
          Комментарий в уведомлених не будет изменен
        </div>
        <TaskDetailCommentItemRight
          className={styles.message}
          taskMessage={taskEditMessageModal.taskMessage!}
        />
        <MessageTextbox
          initialText={taskEditMessageModal.taskMessage?.message}
          icon={<IconEdit className={'link-icon'} />}
          onButtonClick={editMessage}
        />
      </div>
    </Modal>
  );
};

export default TaskDetailEditMessageModal;
