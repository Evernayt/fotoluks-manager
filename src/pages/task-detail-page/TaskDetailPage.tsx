import { LoaderWrapper } from 'components/ui/loader/Loader';
import TaskSidebar from './components/sidebar/TaskSidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import TaskAPI from 'api/TaskAPI/TaskAPI';
import { taskActions } from 'store/reducers/TaskSlice';
import { ITask } from 'models/api/ITask';
import NotificationAPI from 'api/NotificationAPI/NotificationAPI';
import { useToast } from '@chakra-ui/react';
import socketio from 'socket/socketio';
import { UpdateTaskDto } from 'api/TaskAPI/dto/update-task.dto';
import { CreateTaskDto } from 'api/TaskAPI/dto/create-task.dto';
import TaskNavbar from './components/detail-navbar/TaskNavbar';
import TaskCancelModal from './modals/cancel-modal/TaskCancelModal';
import TaskUnsavedDataModal from './modals/unsaved-data-modal/TaskUnsavedDataModal';
import TaskMembersModal from './modals/members-modal/TaskMembersModal';
import TaskMembersSidebar from './components/members-sidebar/TaskMembersSidebar';
import TaskSubtasksModal from './modals/subtasks-modal/TaskSubtasksModal';
import TaskComments from './components/comments/TaskComments';
import TaskEditMessageModal from './modals/edit-message-modal/TaskEditMessageModal';
import { getEmployeeFullName } from 'helpers/employee';
import styles from './TaskDetailPage.module.scss';

type LocationState = {
  state: {
    taskId?: number;
    created?: string;
  };
};

const TaskDetailPage = () => {
  const location = useLocation();
  const { state } = location as LocationState;

  const [viewMode, setViewMode] = useState<boolean>(false);
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
  const taskSubtasksForCreate = useAppSelector(
    (state) => state.task.taskSubtasksForCreate
  );
  const taskSubtasksForUpdate = useAppSelector(
    (state) => state.task.taskSubtasksForUpdate
  );
  const taskSubtasksForDelete = useAppSelector(
    (state) => state.task.taskSubtasksForDelete
  );

  const isTaskCreated = task.id !== 0;

  const dispatch = useAppDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.taskId) {
      fetchTask(state.taskId);
    }
  }, []);

  const fetchTask = (taskId: number) => {
    setIsLoading(true);
    TaskAPI.getOne(taskId)
      .then((data) => {
        dispatch(taskActions.setBeforeTask(data));
        dispatch(taskActions.setTask(data));
        setViewMode(data.personal);
      })
      .catch((e) =>
        toast({
          title: 'TaskDetailPage.fetchTask',
          description: e.response.data ? e.response.data.message : e.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      )
      .finally(() => setIsLoading(false));
  };

  const notifyMembersEdit = (task: ITask) => {
    if (taskMembersForCreate.length) {
      const employeeIds: number[] = [];
      taskMembersForCreate.forEach((employeeId) => {
        employeeIds.push(employeeId);
      });

      const title = 'Добавлен в участники';
      const text = `${getEmployeeFullName(
        employee
      )} добавил вас в участники задачи № ${task.id}`;

      NotificationAPI.create({
        title,
        text,
        employeeIds,
        appId: 4,
        notificationCategoryId: 1,
      }).then((data) => {
        socketio.sendNotification(data, employeeIds);
      });
    }

    if (taskMembersForDelete.length) {
      const title = 'Удален из участников';
      const text = `${getEmployeeFullName(
        employee
      )} удалил вас из участников задачи № ${task.id}`;

      NotificationAPI.create({
        title,
        text,
        employeeIds: taskMembersForDelete,
        appId: 4,
        notificationCategoryId: 1,
      }).then((data) => {
        socketio.sendNotification(data, taskMembersForDelete);
      });
    }
  };

  const closeTaskDetail = () => {
    dispatch(taskActions.clearTask());
    dispatch(taskActions.setForceUpdate(true));
    navigate(-1);
  };

  const updateTaskState = (task: ITask) => {
    dispatch(taskActions.setTask(task));
    dispatch(taskActions.saveTask(task));
    dispatch(taskActions.setHaveUnsavedData(false));

    notifyMembersEdit(task);
  };

  const saveTask = (close: boolean = false) => {
    if (!haveUnsavedData || !employee) return;
    setIsLoading(true);

    if (isTaskCreated) {
      const updateBody: UpdateTaskDto = {
        ...task,
        shopId: task.personal ? null : task.shop?.id,
        departmentId: task.personal ? null : task.department?.id,
        taskMembersForCreate: task.personal ? [] : taskMembersForCreate,
        taskMembersForDelete: task.personal ? [] : taskMembersForDelete,
        taskSubtasksForCreate,
        taskSubtasksForUpdate,
        taskSubtasksForDelete,
      };

      TaskAPI.update(updateBody)
        .then((data) => {
          updateTaskState(data);
          if (close) closeTaskDetail();
        })
        .catch((e) =>
          toast({
            title: 'TaskDetailPage.saveTask',
            description: e.response.data ? e.response.data.message : e.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        )
        .finally(() => setIsLoading(false));
    } else {
      const createBody: CreateTaskDto = {
        ...task,
        shopId: task.personal ? null : task.shop?.id,
        departmentId: task.personal ? null : task.department?.id,
        creatorId: employee.id,
        taskMembersForCreate: task.personal ? [] : taskMembersForCreate,
        taskSubtasksForCreate,
      };

      TaskAPI.create(createBody)
        .then((data) => {
          const taskClone: ITask = {
            ...task,
            id: data.id,
            createdAt: data.createdAt,
          };
          updateTaskState(taskClone);
          if (close) closeTaskDetail();
        })
        .catch((e) =>
          toast({
            title: 'TaskDetailPage.saveTask',
            description: e.response.data ? e.response.data.message : e.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        )
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <>
      <TaskNavbar />
      <TaskCancelModal />
      <TaskUnsavedDataModal
        saveTask={saveTask}
        closeTaskDetail={closeTaskDetail}
      />
      <TaskMembersModal />
      <TaskSubtasksModal />
      <TaskEditMessageModal />
      <LoaderWrapper isLoading={isLoading} width="100%" height="100%">
        <div className={styles.container}>
          <TaskSidebar
            saveTask={saveTask}
            closeTaskDetail={closeTaskDetail}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <div className={styles.comments}>
            {isTaskCreated && state.taskId && (
              <TaskComments taskId={state.taskId} />
            )}
          </div>
          {!task.personal && <TaskMembersSidebar />}
        </div>
      </LoaderWrapper>
    </>
  );
};

export default TaskDetailPage;
