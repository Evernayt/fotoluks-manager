import TaskAPI from 'api/TaskAPI/TaskAPI';
import { DetailNavmenu, IconButton, Tooltip } from 'components';
import { IconButtonVariants } from 'components/UI/IconButton/IconButton';
import { DEF_DATE_FORMAT } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IModal } from 'hooks/useModal';
import { IconTrash, IconTrashOff } from 'icons';
import moment from 'moment';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskSlice } from 'store/reducers/TaskSlice';

interface TasksDetailNavmenuProps {
  checkUnsavedDataAndCloseTaskDetail: () => void;
}

const TasksDetailNavmenu: FC<TasksDetailNavmenuProps> = ({
  checkUnsavedDataAndCloseTaskDetail,
}) => {
  const task = useAppSelector((state) => state.task.task);
  const employee = useAppSelector((state) => state.employee.employee);
  const haveUnsavedData = useAppSelector((state) => state.task.haveUnsavedData);

  const created = moment(task.createdAt).format(DEF_DATE_FORMAT);
  const title =
    task.id === 0 ? 'Новая задача' : `Задача № ${task.id} от ${created}`;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleArchive = () => {
    TaskAPI.update({ id: task.id, archive: !task.archive }).then((data) => {
      dispatch(taskSlice.actions.setTask(data));
      dispatch(taskSlice.actions.setBeforeTask(data));
      dispatch(taskSlice.actions.setHaveUnsavedData(false));
    });
  };

  const rightSection = () => {
    return (
      <>
        {task.creator?.id === employee?.id && (
          <Tooltip
            label={task.archive ? 'Удалить из архива' : 'Добавить в архив'}
            placement="left"
          >
            <div>
              <IconButton
                variant={IconButtonVariants.link}
                icon={
                  task.archive ? (
                    <IconTrashOff className="link-icon" />
                  ) : (
                    <IconTrash className="link-icon" />
                  )
                }
                onClick={toggleArchive}
              />
            </div>
          </Tooltip>
        )}
      </>
    );
  };

  return (
    <DetailNavmenu
      title={title}
      onClose={checkUnsavedDataAndCloseTaskDetail}
      rightSection={rightSection()}
    />
  );
};

export default TasksDetailNavmenu;
