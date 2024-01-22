import { useAppDispatch, useAppSelector } from 'hooks/redux';
import moment from 'moment';
import { UI_DATE_FORMAT } from 'constants/app';
import TaskAPI from 'api/TaskAPI/TaskAPI';
import { taskActions } from 'store/reducers/TaskSlice';
import { IconCircleCheck } from '@tabler/icons-react';
import { Linkify } from 'components';
import { Button, Card, CardBody, Text } from '@chakra-ui/react';
import styles from './TaskExecutor.module.scss';

const TaskExecutor = () => {
  const task = useAppSelector((state) => state.task.task);
  const employee = useAppSelector((state) => state.employee.employee);

  const date = moment(task.completedDate).format(UI_DATE_FORMAT);

  const dispatch = useAppDispatch();

  const cancelTask = () => {
    TaskAPI.update({
      id: task.id,
      completed: false,
      completedDate: null,
      completionNote: '',
      executorId: null,
    }).then((data) => {
      dispatch(taskActions.setTask(data));
      dispatch(taskActions.setBeforeTask(data));
      dispatch(taskActions.setHaveUnsavedData(false));
    });
  };

  return (
    <Card className={styles.container}>
      <CardBody>
        <div className={styles.completed}>
          <IconCircleCheck color="var(--completed-text-color)" />
          <Text as="b" color="var(--completed-text-color)">
            Завершено
          </Text>
        </div>
        <Text>{`Исполнитель: ${task.executor?.name}`}</Text>
        <Text>{`Дата и время: ${date}`}</Text>
        {task.completionNote && (
          <Linkify>{`Примечание: ${task.completionNote}`}</Linkify>
        )}
        {(employee?.id === task.executor?.id ||
          employee?.id === task.creator?.id) && (
          <Button className={styles.cancel_button} onClick={cancelTask}>
            Отменить
          </Button>
        )}
      </CardBody>
    </Card>
  );
};

export default TaskExecutor;
