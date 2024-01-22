import { ITaskMessage } from 'models/api/ITaskMessage';
import moment from 'moment';
import { FC } from 'react';
import { UI_DATE_FORMAT } from 'constants/app';
import { Linkify } from 'components';
import { Avatar, Text } from '@chakra-ui/react';
import { getEmployeeFullName } from 'helpers/employee';
import styles from './TaskCommentItem.module.scss';

interface TaskCommentItemLeftProps {
  taskMessage: ITaskMessage;
}

const TaskCommentItemLeft: FC<TaskCommentItemLeftProps> = ({ taskMessage }) => {
  const created = moment(taskMessage.createdAt).format(UI_DATE_FORMAT);

  const getEditedText = taskMessage.edited ? '(изменено)' : '';

  return (
    <div className={styles.container}>
      <Avatar
        className={styles.avatar}
        name={getEmployeeFullName(taskMessage.employee)}
        src={taskMessage.employee.avatar || undefined}
      />
      <div>
        <Text className={styles.name}>
          {getEmployeeFullName(taskMessage.employee)}
        </Text>
        <div className={styles.left_section}>
          <Linkify>{taskMessage.message}</Linkify>
          <Text
            className={styles.bottom_text}
          >{`${getEditedText} ${created}`}</Text>
        </div>
      </div>
    </div>
  );
};

export default TaskCommentItemLeft;
