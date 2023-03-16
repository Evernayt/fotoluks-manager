import { DEF_DATE_FORMAT } from 'constants/app';
import { ITaskMessage } from 'models/api/ITaskMessage';
import moment from 'moment';
import { FC } from 'react';
import styles from './TaskDetailCommentItem.module.scss';

interface TaskDetailCommentItemRightProps {
  taskMessage: ITaskMessage;
}

const TaskDetailCommentItemRight: FC<TaskDetailCommentItemRightProps> = ({
  taskMessage,
}) => {
  const created = moment(taskMessage.createdAt).format(DEF_DATE_FORMAT);

  return (
    <li className={[styles.container, styles.right_container].join(' ')}>
      <div className={styles.right_section}>
        <div>{taskMessage.message}</div>
        <div className={styles.date}>{created}</div>
      </div>
    </li>
  );
};

export default TaskDetailCommentItemRight;
