import { Button, Modal } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { FC } from 'react';
import styles from './TaskDetailUnsavedDataModal.module.scss';

interface TaskDetailUnsavedDataModalProps {
  isShowing: boolean;
  hide: () => void;
  saveTask: () => void;
  closeTaskDetail: () => void;
}

const TaskDetailUnsavedDataModal: FC<TaskDetailUnsavedDataModalProps> = ({
  isShowing,
  hide,
  saveTask,
  closeTaskDetail,
}) => {
  const closeTask = () => {
    hide();
    closeTaskDetail();
  };

  const saveTaskAndClose = () => {
    saveTask();
    closeTask();
  };

  return (
    <Modal title="Сохранить изменения?" isShowing={isShowing} hide={hide}>
      <span className={styles.message}>Есть не сохраненные данные.</span>
      <div className={styles.controls}>
        <Button style={{ minWidth: 'max-content' }} onClick={hide}>
          Продолжить редактирование
        </Button>
        <Button style={{ margin: '0 8px' }} onClick={closeTask}>
          Нет
        </Button>
        <Button variant={ButtonVariants.primary} onClick={saveTaskAndClose}>
          Да
        </Button>
      </div>
    </Modal>
  );
};

export default TaskDetailUnsavedDataModal;
