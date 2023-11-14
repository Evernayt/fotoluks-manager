import { DEF_DATE_FORMAT } from 'constants/app';
import { ITaskMessage } from 'models/api/ITaskMessage';
import moment from 'moment';
import { FC } from 'react';
import styles from './TaskDetailCommentItem.module.scss';
import { ElectronLinkify } from 'components';
import { useContextMenu } from 'react-contexify';
import { TASK_DETAIL_COMMENTS_MENU_ID } from '../ContextMenu/TaskDetailCommentsContextMenu';

interface TaskDetailCommentItemRightProps {
  taskMessage: ITaskMessage;
  className?: string;
}

const TaskDetailCommentItemRight: FC<TaskDetailCommentItemRightProps> = ({
  taskMessage,
  className,
}) => {
  const created = moment(taskMessage.createdAt).format(DEF_DATE_FORMAT);

  const { show } = useContextMenu({ id: TASK_DETAIL_COMMENTS_MENU_ID });

  const handleContextMenu = (event: any) => {
    show({ event, props: { taskMessage } });
  };

  const getEditedText = taskMessage.edited ? '(изменено)' : '';

  return (
    <li
      className={[styles.container, styles.right_container].join(' ')}
      onContextMenu={handleContextMenu}
    >
      <div className={[styles.right_section, className].join(' ')}>
        <ElectronLinkify>{taskMessage.message}</ElectronLinkify>
        <div
          className={styles.bottom_text}
        >{`${getEditedText} ${created}`}</div>
      </div>
    </li>
  );
};

export default TaskDetailCommentItemRight;
