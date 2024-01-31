import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { DetailNavbar } from 'components';
import { IconArchive, IconArchiveOff } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE, UI_DATE_FORMAT } from 'constants/app';
import moment from 'moment';
import TaskAPI from 'api/TaskAPI/TaskAPI';
import { taskActions } from 'store/reducers/TaskSlice';
import { modalActions } from 'store/reducers/ModalSlice';

const TaskNavbar = () => {
  const task = useAppSelector((state) => state.task.task);
  const employee = useAppSelector((state) => state.employee.employee);
  const haveUnsavedData = useAppSelector((state) => state.task.haveUnsavedData);

  const created = moment(task.createdAt).format(UI_DATE_FORMAT);
  const title =
    task.id === 0 ? 'Новая задача' : `Задача № ${task.id} от ${created}`;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleArchive = () => {
    TaskAPI.update({ id: task.id, archive: !task.archive }).then((data) => {
      dispatch(taskActions.setTask(data));
      dispatch(taskActions.setBeforeTask(data));
      dispatch(taskActions.setHaveUnsavedData(false));
    });
  };

  const closeTaskDetail = () => {
    if (haveUnsavedData) {
      openUnsavedDataModal();
    } else {
      dispatch(taskActions.clearTask());
      dispatch(taskActions.setForceUpdate(true));
      navigate(-1);
    }
  };

  const openUnsavedDataModal = () => {
    dispatch(modalActions.openModal({ modal: 'taskUnsavedDataModal' }));
  };

  const rightSection = () => {
    return (
      <>
        {task.creator?.id === employee?.id && (
          <Tooltip
            label={task.archive ? 'Убрать из архива' : 'Добавить в архив'}
            placement="left"
          >
            <IconButton
              variant="ghost"
              icon={
                task.archive ? (
                  <IconArchiveOff size={ICON_SIZE} stroke={ICON_STROKE} />
                ) : (
                  <IconArchive size={ICON_SIZE} stroke={ICON_STROKE} />
                )
              }
              aria-label="archive"
              onClick={toggleArchive}
            />
          </Tooltip>
        )}
      </>
    );
  };

  return (
    <DetailNavbar
      title={title}
      rightSection={rightSection()}
      onClose={closeTaskDetail}
    />
  );
};

export default TaskNavbar;
