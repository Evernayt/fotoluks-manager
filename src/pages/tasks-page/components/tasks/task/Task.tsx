import { TASK_DETAIL_ROUTE } from 'constants/paths';
import { ITask } from 'models/api/ITask';
import moment from 'moment';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconBinaryTree2,
  IconBuildingStore,
  IconCalendarDue,
  IconCircleCheck,
  IconMessageCircle,
} from '@tabler/icons-react';
import { UI_DATE_FORMAT } from 'constants/app';
import { Tag, Text } from '@chakra-ui/react';
import styles from './Task.module.scss';

interface TaskProps {
  task: ITask;
}

const Task: FC<TaskProps> = ({ task }) => {
  const navigate = useNavigate();

  const created = moment(task.createdAt).format(UI_DATE_FORMAT);

  const taskClickHandler = () => {
    navigate(TASK_DETAIL_ROUTE, {
      state: { taskId: task.id, created: task.createdAt },
    });
  };

  return (
    <div className={styles.container} onClick={taskClickHandler}>
      <div>
        {task.completed && (
          <div className={styles.completed}>
            <IconCircleCheck color="var(--completed-text-color)" />
            <Text as="b" color="var(--completed-text-color)">
              Завершенo
            </Text>
          </div>
        )}
        <Text
          className={[
            styles.title_text,
            task.completed && styles.title_completed,
          ].join(' ')}
        >
          {`${task.id}. ${task.title || 'Без загаловка'}`}
        </Text>
        {!task.completed && (
          <Text className={styles.description}>{task.description}</Text>
        )}
      </div>
      <div>
        <div className={styles.info}>
          {task.urgent && <Tag colorScheme="red">Срочное</Tag>}
          {task.personal && <Tag colorScheme="blue">Личное</Tag>}
          <div className={styles.item}>
            <IconCalendarDue className={styles.item_icon} />
            <div className={styles.item_text}>{created}</div>
          </div>
          {task.taskMessages && task.taskMessages.length > 0 && (
            <div className={styles.item}>
              <IconMessageCircle className={styles.item_icon} />
              <div className={styles.item_text}>{task.taskMessages.length}</div>
            </div>
          )}
          {task.shop && (
            <div className={styles.item}>
              <IconBuildingStore className={styles.item_icon} />
              <div className={styles.item_text}>{task.shop.abbreviation}</div>
            </div>
          )}
          {task.department && (
            <div className={styles.item}>
              <IconBinaryTree2 className={styles.item_icon} />
              <div className={styles.item_text}>{task.department.name}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;
