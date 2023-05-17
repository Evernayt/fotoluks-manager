import NotificationAPI from 'api/NotificationAPI/NotificationAPI';
import { CreateTaskDto } from 'api/TaskAPI/dto/create-task.dto';
import { UpdateTaskDto } from 'api/TaskAPI/dto/update-task.dto';
import TaskAPI from 'api/TaskAPI/TaskAPI';
import TaskMessageAPI from 'api/TaskMessageAPI/TaskMessageAPI';
import { Loader } from 'components';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import { useModal } from 'hooks';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { ITask } from 'models/api/ITask';
import { GlobalMessageVariants } from 'models/IGlobalMessage';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import socketio from 'socket/socketio';
import { taskSlice } from 'store/reducers/TaskSlice';
import TasksDetailComments from './Comments/TasksDetailComments';
import TaskDetailCancelModal from './Modals/CancelModal/TaskDetailCancelModal';
import TaskDetailMembersModal from './Modals/MembersModal/TaskDetailMembersModal';
import TaskDetailUnsavedDataModal from './Modals/UnsavedDataModal/TaskDetailUnsavedDataModal';
import TasksDetailNavmenu from './Navmenu/TasksDetailNavmenu';
import TasksDetailSidemenu from './Sidemenu/TasksDetailSidemenu';
import styles from './TasksDetailPage.module.scss';

type LocationState = {
  state: {
    taskId?: number;
    created?: string;
  };
};

const TasksDetailPage = () => {
  const location = useLocation();
  const { state } = location as LocationState;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const haveUnsavedData = useAppSelector((state) => state.task.haveUnsavedData);
  const task = useAppSelector((state) => state.task.task);
  const employee = useAppSelector((state) => state.employee.employee);
  const taskMembersForCreate = useAppSelector(
    (state) => state.task.taskMembersForCreate
  );
  const taskMembersForDelete = useAppSelector(
    (state) => state.task.taskMembersForDelete
  );

  const isTaskCreated = task.id !== 0;

  const cancelTaskModal = useModal();
  const unsavedDataModal = useModal();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (state?.taskId) {
      fetchTask(state.taskId);
    }
  }, []);

  const fetchTask = (taskId: number) => {
    setIsLoading(true);
    TaskAPI.getOne(taskId)
      .then((data) => {
        dispatch(taskSlice.actions.setBeforeTask(data));
        dispatch(taskSlice.actions.setTask(data));

        TaskMessageAPI.getAll({ taskId }).then((data) => {
          dispatch(taskSlice.actions.setTaskMessages(data.rows));
        });
      })
      .finally(() => setIsLoading(false));
  };

  const notifyMembersEdit = (task: ITask) => {
    if (taskMembersForCreate.length) {
      const employeeIds: number[] = [];
      taskMembersForCreate.forEach((employeeId) => {
        employeeIds.push(employeeId);
      });

      const title = 'Добавлен в участники';
      const text = `${employee?.name} добавил вас в участники задачи № ${task.id}`;

      NotificationAPI.create({
        title,
        text,
        employeeIds,
        appId: 4,
        notificationCategoryId: 1,
      }).then((data) => {
        socketio.sendNotification(data);
      });
    }

    if (taskMembersForDelete.length) {
      const title = 'Удален из участников';
      const text = `${employee?.name} удалил вас из участников задачи № ${task.id}`;

      NotificationAPI.create({
        title,
        text,
        employeeIds: taskMembersForDelete,
        appId: 4,
        notificationCategoryId: 1,
      }).then((data) => {
        socketio.sendNotification(data);
      });
    }
  };

  const isValidationSuccess = () => {
    if (task.shop?.id === 0) {
      showGlobalMessage('Выберите филиал', GlobalMessageVariants.warning);
      return false;
    } else if (task.department?.id === 0) {
      showGlobalMessage('Выберите отдел', GlobalMessageVariants.warning);
      return false;
    } else {
      return true;
    }
  };

  const updateTaskState = (task: ITask) => {
    dispatch(taskSlice.actions.setTask(task));
    dispatch(taskSlice.actions.saveTask(task));
    dispatch(taskSlice.actions.setHaveUnsavedData(false));

    notifyMembersEdit(task);
  };

  const saveTask = () => {
    if (!isValidationSuccess() || !haveUnsavedData || !employee) return;

    setIsLoading(true);

    if (isTaskCreated) {
      const updateBody: UpdateTaskDto = {
        ...task,
        shopId: task.shop?.id,
        departmentId: task.department?.id,
        taskMembersForCreate,
        taskMembersForDelete,
      };

      TaskAPI.update(updateBody)
        .then((data) => {
          updateTaskState(data);
        })
        .catch((e) =>
          showGlobalMessage(
            e.response.data ? e.response.data.message : e.message
          )
        )
        .finally(() => setIsLoading(false));
    } else {
      const createBody: CreateTaskDto = {
        ...task,
        shopId: task.shop?.id,
        departmentId: task.department?.id,
        creatorId: employee.id,
        taskMembersForCreate,
      };

      TaskAPI.create(createBody)
        .then((data) => {
          const taskClone: ITask = {
            ...task,
            id: data.id,
            createdAt: data.createdAt,
          };
          updateTaskState(taskClone);
        })
        .catch((e) =>
          showGlobalMessage(
            e.response.data ? e.response.data.message : e.message
          )
        )
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className={styles.container}>
      {cancelTaskModal.isShowing && (
        <TaskDetailCancelModal
          isShowing={cancelTaskModal.isShowing}
          hide={cancelTaskModal.toggle}
        />
      )}
      {unsavedDataModal.isShowing && (
        <TaskDetailUnsavedDataModal
          isShowing={unsavedDataModal.isShowing}
          hide={unsavedDataModal.toggle}
          saveTask={saveTask}
        />
      )}
      <TaskDetailMembersModal />
      <TasksDetailNavmenu unsavedDataModal={unsavedDataModal} />
      {isLoading && (
        <div className={styles.loader}>
          <Loader />
        </div>
      )}
      <div className={styles.section}>
        <TasksDetailSidemenu
          cancelTaskModal={cancelTaskModal}
          saveTask={saveTask}
        />
        <div className={styles.comments}>
          {isTaskCreated && <TasksDetailComments />}
        </div>
      </div>
    </div>
  );
};

export default TasksDetailPage;
