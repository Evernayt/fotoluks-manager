import { Button, Modal } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch } from 'hooks/redux';
import { FC } from 'react';
import { taskSlice } from 'store/reducers/TaskSlice';
import styles from './TaskDetailCancelModal.module.scss';

interface TaskDetailCancelModalProps {
  isShowing: boolean;
  hide: () => void;
}

const TaskDetailCancelModal: FC<TaskDetailCancelModalProps> = ({
  isShowing,
  hide,
}) => {
  const dispatch = useAppDispatch();

  const cancel = () => {
    dispatch(taskSlice.actions.undoTask());
    hide();
  };

  return (
    <Modal title="Отменить изменения?" isShowing={isShowing} hide={hide}>
      <span className={styles.message}>
        Вы уверены что хотите отменить все изменения?{`\n`}Не сохраненные данные
        будут удалены.
      </span>
      <div className={styles.controls}>
        <Button
          style={{ marginRight: '8px', minWidth: 'max-content' }}
          onClick={hide}
        >
          Продолжить редактирование
        </Button>
        <Button variant={ButtonVariants.primary} onClick={cancel}>
          Отменить
        </Button>
      </div>
    </Modal>
  );
};

export default TaskDetailCancelModal;
