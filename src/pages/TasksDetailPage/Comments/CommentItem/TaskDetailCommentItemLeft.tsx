import { DEF_DATE_FORMAT } from 'constants/app';
import { defaultAvatar } from 'constants/images';
import { ITaskMessage } from 'models/api/ITaskMessage';
import moment from 'moment';
import { FC } from 'react';
import styles from './TaskDetailCommentItem.module.scss';
import { ElectronLinkify } from 'components';

interface TaskDetailCommentItemLeftProps {
  taskMessage: ITaskMessage;
}

const TaskDetailCommentItemLeft: FC<TaskDetailCommentItemLeftProps> = ({
  taskMessage,
}) => {
  const created = moment(taskMessage.createdAt).format(DEF_DATE_FORMAT);

  return (
    <li className={styles.container}>
      <img
        className={styles.avatar}
        src={taskMessage.employee.avatar || defaultAvatar}
        alt="avatar"
      />
      <div>
        <div className={styles.name}>{taskMessage.employee.name}</div>
        <div className={styles.left_section}>
          <ElectronLinkify>{taskMessage.message}</ElectronLinkify>
          <div className={styles.date}>{created}</div>
        </div>
      </div>
    </li>
  );
};

export default TaskDetailCommentItemLeft;
