import { FC } from 'react';
import { ITaskSubtask } from 'models/api/ITaskSubtask';
import { IconButton } from '@chakra-ui/react';
import { IconTrash } from '@tabler/icons-react';
import styles from './TaskSubtaskItem.module.scss';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { AutoResizableTextarea } from 'components';

interface TaskSubtaskItemProps {
  taskSubtask: ITaskSubtask;
  onChange: (id: number | string, text: string) => void;
  onDelete: (id: number | string) => void;
}

const TaskSubtaskItem: FC<TaskSubtaskItemProps> = ({
  taskSubtask,
  onChange,
  onDelete,
}) => {
  return (
    <div className={styles.container}>
      <AutoResizableTextarea
        value={taskSubtask.text}
        placeholder="Введите текст"
        onChange={(e) => onChange(taskSubtask.id, e.target.value)}
      />
      <IconButton
        icon={
          <IconTrash
            className="link-icon"
            size={ICON_SIZE}
            stroke={ICON_STROKE}
          />
        }
        aria-label="remove"
        variant="ghost"
        onClick={() => onDelete(taskSubtask.id)}
      />
    </div>
  );
};

export default TaskSubtaskItem;
