import { AvatarList } from 'components';
import { IAvatarListItem } from 'components/UI/AvatarList/AvatarList.types';
import { DEF_DATE_FORMAT } from 'constants/app';
import { defaultAvatar } from 'constants/images';
import { TASKS_DETAIL_ROUTE } from 'constants/paths';
import {
  IconBinaryTree,
  IconCalendarDue,
  IconCheckFilled,
  IconMessageCircle,
  IconShop,
} from 'icons';
import { ITask } from 'models/api/ITask';
import moment from 'moment';
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Task.module.scss';

interface TaskProps {
  task: ITask;
}

const Task: FC<TaskProps> = ({ task }) => {
  const taskMembers = useMemo(() => {
    const employees: IAvatarListItem[] = [];
    task.taskMembers?.forEach((taskMember) => {
      employees.push({
        id: taskMember.employee.id,
        name: taskMember.employee.name,
        avatar: taskMember.employee.avatar || defaultAvatar,
      });
    });
    return employees;
  }, [task.taskMembers]);

  const navigate = useNavigate();

  const created = moment(task.createdAt).format(DEF_DATE_FORMAT);

  const taskClickHandler = () => {
    navigate(TASKS_DETAIL_ROUTE, {
      state: { taskId: task.id, created: task.createdAt },
    });
  };

  return (
    <div className={styles.container} onClick={taskClickHandler}>
      <div>
        {task.completed && (
          <div className={styles.completed}>
            <IconCheckFilled className={styles.completed_icon} />
            <div>Завершенo</div>
          </div>
        )}
        <div
          className={[
            styles.title_text,
            task.completed && styles.title_completed,
          ].join(' ')}
        >
          {`${task.id}. ${task.title}`}
        </div>

        {!task.completed && (
          <div className={styles.description}>{task.description}</div>
        )}
      </div>
      <div>
        <AvatarList items={taskMembers} />
        <div className={styles.info}>
          {task.urgent && <div className={styles.urgent}>Срочно</div>}
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
          <div className={styles.item}>
            <IconShop className={styles.item_icon} />
            <div className={styles.item_text}>{task.shop?.abbreviation}</div>
          </div>
          <div className={styles.item}>
            <IconBinaryTree className={styles.item_icon} />
            <div className={styles.item_text}>{task.department?.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
