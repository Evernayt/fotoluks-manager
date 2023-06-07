import { Button, Modal } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './TaskDetailSubtasksModal.module.scss';
import { ButtonVariants } from 'components/UI/Button/Button';
import { ITaskSubtask } from 'models/api/ITaskSubtask';
import { v4 as uuidv4 } from 'uuid';
import { taskSlice } from 'store/reducers/TaskSlice';
import { IconListCheck } from 'icons';
import TaskDetailSubtaskItem from './SubtaskItem/TaskDetailSubtaskItem';

const TaskDetailSubtasksModal = () => {
  const taskSubtasksModal = useAppSelector(
    (state) => state.modal.taskSubtasksModal
  );
  const task = useAppSelector((state) => state.task.task);

  const dispatch = useAppDispatch();

  const createSubtask = () => {
    const createdSubtask: ITaskSubtask = {
      id: uuidv4(),
      text: '',
      completed: false,
    };
    dispatch(taskSlice.actions.addTaskSubtask(createdSubtask));
    dispatch(taskSlice.actions.addTaskSubtaskForCreate(createdSubtask));
  };

  const deleteSubTaskHandler = (id: number | string) => {
    dispatch(taskSlice.actions.deleteTaskSubtask(id));
    if (typeof id === 'number') {
      dispatch(taskSlice.actions.addTaskSubtaskIdForDelete(id));
    }
  };

  const changeTextHandler = (id: number | string, text: string) => {
    dispatch(taskSlice.actions.editTaskSubtaskById({ id, text }));
    if (typeof id === 'string') {
      dispatch(taskSlice.actions.editTaskSubtaskForCreate({ id, text }));
    } else if (typeof id === 'number') {
      dispatch(taskSlice.actions.editTaskSubtaskForUpdate({ id, text }));
    }
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('taskSubtasksModal'));
  };

  return (
    <Modal
      title="Подзадачи"
      isShowing={taskSubtasksModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        {task.taskSubtasks?.length ? (
          <div className={styles.subtasks}>
            {task.taskSubtasks.map((taskSubtask) => (
              <TaskDetailSubtaskItem
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
            <div>Нет подзадач</div>
          </div>
        )}
        <Button variant={ButtonVariants.primary} onClick={createSubtask}>
          Добавить подзадачу
        </Button>
      </div>
    </Modal>
  );
};

export default TaskDetailSubtasksModal;
