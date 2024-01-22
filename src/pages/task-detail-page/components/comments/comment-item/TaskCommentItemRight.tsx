import { UI_DATE_FORMAT } from 'constants/app';
import { ITaskMessage } from 'models/api/ITaskMessage';
import moment from 'moment';
import { FC } from 'react';
import { Linkify } from 'components';
import { useContextMenu } from 'react-contexify';
import { TASK_DETAIL_COMMENTS_MENU_ID } from '../context-menu/TaskCommentsContextMenu';
import { Text } from '@chakra-ui/react';
import styles from './TaskCommentItem.module.scss';

interface TaskCommentItemRightProps {
  taskMessage: ITaskMessage;
  className?: string;
}

const TaskCommentItemRight: FC<TaskCommentItemRightProps> = ({
  taskMessage,
  className,
}) => {
  const created = moment(taskMessage.createdAt).format(UI_DATE_FORMAT);

  const { show } = useContextMenu({ id: TASK_DETAIL_COMMENTS_MENU_ID });

  const handleContextMenu = (event: any) => {
    show({ event, props: { taskMessage } });
  };

  const getEditedText = taskMessage.edited ? '(изменено)' : '';

  return (
    <div
      className={[styles.container, styles.right_container].join(' ')}
      onContextMenu={handleContextMenu}
    >
      <div className={[styles.right_section, className].join(' ')}>
        <Linkify>{taskMessage.message}</Linkify>
        <Text
          className={styles.bottom_text}
        >{`${getEditedText} ${created}`}</Text>
      </div>
    </div>
  );
};

export default TaskCommentItemRight;
