import TaskAPI from 'api/TaskAPI/TaskAPI';
import { Button, ElectronLinkify } from 'components';
import { DEF_DATE_FORMAT } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconCheckFilled } from 'icons';
import moment from 'moment';
import { taskSlice } from 'store/reducers/TaskSlice';
import styles from './TasksDetailExecutor.module.scss';

const TasksDetailExecutor = () => {
  const task = useAppSelector((state) => state.task.task);
  const employee = useAppSelector((state) => state.employee.employee);

  const date = moment(task.completedDate).format(DEF_DATE_FORMAT);

  const dispatch = useAppDispatch();

  const cancelTask = () => {
    TaskAPI.update({
      id: task.id,
      completed: false,
      completedDate: null,
      completionNote: '',
      executorId: null,
    }).then((data) => {
      dispatch(taskSlice.actions.setTask(data));
      dispatch(taskSlice.actions.setBeforeTask(data));
      dispatch(taskSlice.actions.setHaveUnsavedData(false));
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.completed}>
        <IconCheckFilled className={styles.icon} />
        <div>Завершено</div>
      </div>
      <div>{`Исполнитель: ${task.executor?.name}`}</div>
      <div>{`Дата и время: ${date}`}</div>
      {task.completionNote && (
        <ElectronLinkify>{`Примечание: ${task.completionNote}`}</ElectronLinkify>
      )}
      {(employee?.id === task.executor?.id ||
        employee?.id === task.creator?.id) && (
        <Button className={styles.cancel_btn} onClick={cancelTask}>
          Отменить
        </Button>
      )}
    </div>
  );
};

export default TasksDetailExecutor;
