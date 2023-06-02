import { DEF_DATE_FORMAT } from 'constants/app';
import { ITaskMessage } from 'models/api/ITaskMessage';
import moment from 'moment';
import { FC } from 'react';
import styles from './TaskDetailCommentItem.module.scss';
import { ElectronLinkify } from 'components';

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
        <ElectronLinkify>{taskMessage.message}</ElectronLinkify>
        <div className={styles.date}>{created}</div>
      </div>
    </li>
  );
};

export default TaskDetailCommentItemRight;
