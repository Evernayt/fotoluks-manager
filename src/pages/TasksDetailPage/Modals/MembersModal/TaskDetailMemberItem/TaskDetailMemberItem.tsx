import { IconButton } from 'components';
import { defaultAvatar } from 'constants/images';
import { IconMinus, IconPlus } from 'icons';
import { IEmployee } from 'models/api/IEmployee';
import { FC } from 'react';
import styles from './TaskDetailMemberItem.module.scss';

interface TaskDetailMemberItemProps {
  employee: IEmployee;
  isAdded: boolean;
  onClick: () => void;
}

const TaskDetailMemberItem: FC<TaskDetailMemberItemProps> = ({
  employee,
  isAdded,
  onClick,
}) => {
  return (
    <div className={styles.container}>
      <img className={styles.avatar} src={employee.avatar || defaultAvatar} />
      {employee.name}
      <IconButton
        className={styles.button}
        icon={
          isAdded ? (
            <IconMinus className="secondary-icon" />
          ) : (
            <IconPlus className="secondary-icon" />
          )
        }
        onClick={onClick}
      />
    </div>
  );
};

export default TaskDetailMemberItem;
