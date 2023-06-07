import { FC } from 'react';
import styles from './TaskDetailSubtaskItem.module.scss';
import { ITaskSubtask } from 'models/api/ITaskSubtask';
import { IconButton, Textbox } from 'components';
import { IconTrash } from 'icons';
import { IconButtonVariants } from 'components/UI/IconButton/IconButton';

interface TaskDetailSubtaskItemProps {
  taskSubtask: ITaskSubtask;
  onChange: (id: number | string, text: string) => void;
  onDelete: (id: number | string) => void;
}

const TaskDetailSubtaskItem: FC<TaskDetailSubtaskItemProps> = ({
  taskSubtask,
  onChange,
  onDelete,
}) => {
  return (
    <div className={styles.container}>
      <Textbox
        value={taskSubtask.text}
        placeholder="Введите текст"
        onChange={(e) => onChange(taskSubtask.id, e.target.value)}
      />
      <IconButton
        icon={<IconTrash className="link-icon" />}
        variant={IconButtonVariants.link}
        onClick={() => onDelete(taskSubtask.id)}
      />
    </div>
  );
};

export default TaskDetailSubtaskItem;
