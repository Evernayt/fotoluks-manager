import { IShop } from 'models/api/IShop';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITask } from 'models/api/ITask';
import { ITaskMember } from 'models/api/ITaskMember';
import { IDepartment } from 'models/api/IDepartment';
import { ITaskMessage } from 'models/api/ITaskMessage';
import { ITaskSubtask } from 'models/api/ITaskSubtask';
import { UpdateTaskSubtaskDto } from 'api/TaskSubtaskAPI/dto/update-task-subtask.dto';
import { INITIAL_TASK } from 'constants/initialStates';
import {
  INITIAL_TASKS_FILTER_STATE,
  ITasksFilterState,
} from 'pages/tasks-page/modals/filter-modal/TasksFilterModal';
import { FETCH_MORE_LIMIT } from 'constants/app';

type TaskState = {
  tasks: ITask[];
  task: ITask;
  beforeTask: ITask;
  taskMessages: ITaskMessage[];
  taskMembersForCreate: number[];
  taskMembersForDelete: number[];
  haveUnsavedData: boolean;
  forceUpdate: boolean;
  filterState: ITasksFilterState;
  isLoading: boolean;
  search: string;
  activeStatus: number;
  activeSidebarIndex: number;
  sidebarIsOpen: boolean;
  taskSubtasksForCreate: ITaskSubtask[];
  taskSubtasksForUpdate: UpdateTaskSubtaskDto[];
  taskSubtasksForDelete: number[];
};

const initialState: TaskState = {
  tasks: [],
  task: INITIAL_TASK,
  beforeTask: INITIAL_TASK,
  taskMessages: [],
  taskMembersForCreate: [],
  taskMembersForDelete: [],
  haveUnsavedData: false,
  forceUpdate: false,
  filterState: INITIAL_TASKS_FILTER_STATE,
  isLoading: true,
  search: '',
  activeStatus: 0,
  activeSidebarIndex: 0,
  sidebarIsOpen: true,
  taskSubtasksForCreate: [],
  taskSubtasksForUpdate: [],
  taskSubtasksForDelete: [],
};

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<ITask[]>) {
      state.tasks = action.payload;
    },
    setBeforeTask(state, action: PayloadAction<ITask>) {
      state.beforeTask = action.payload;
    },
    setTask(state, action: PayloadAction<ITask>) {
      state.task = action.payload;
    },
    setTitle(state, action: PayloadAction<string>) {
      state.task.title = action.payload;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.task.description = action.payload;
    },
    setShop(state, action: PayloadAction<IShop>) {
      state.task.shop = action.payload;
    },
    setDepartment(state, action: PayloadAction<IDepartment>) {
      state.task.department = action.payload;
    },
    setUrgent(state, action: PayloadAction<boolean>) {
      state.task.urgent = action.payload;
    },
    setPersonal(state, action: PayloadAction<boolean>) {
      state.task.personal = action.payload;
    },
    setTaskMessages(state, action: PayloadAction<ITaskMessage[]>) {
      state.taskMessages = action.payload;
    },
    addTaskMessage(state, action: PayloadAction<ITaskMessage>) {
      state.taskMessages.unshift(action.payload);
      if (state.taskMessages.length > FETCH_MORE_LIMIT) {
        state.taskMessages.pop();
      }
    },
    addTaskMessages(state, action: PayloadAction<ITaskMessage[]>) {
      state.taskMessages.push(...action.payload);
    },
    setHaveUnsavedData(state, action: PayloadAction<boolean>) {
      state.haveUnsavedData = action.payload;
    },
    undoTask(state) {
      state.task = state.beforeTask;
      state.taskMembersForCreate = [];
      state.taskMembersForDelete = [];
      state.taskSubtasksForCreate = [];
      state.taskSubtasksForUpdate = [];
      state.taskSubtasksForDelete = [];
    },
    clearTask(state) {
      state.task = INITIAL_TASK;
      state.beforeTask = INITIAL_TASK;
      state.taskMembersForCreate = [];
      state.taskMembersForDelete = [];
      state.taskSubtasksForCreate = [];
      state.taskSubtasksForUpdate = [];
      state.taskSubtasksForDelete = [];
      state.taskMessages = [];
    },
    saveTask(state, action: PayloadAction<ITask>) {
      state.beforeTask = action.payload;
      state.taskMembersForCreate = [];
      state.taskMembersForDelete = [];
      state.taskSubtasksForCreate = [];
      state.taskSubtasksForUpdate = [];
      state.taskSubtasksForDelete = [];
    },
    addTaskMember(state, action: PayloadAction<ITaskMember>) {
      state.task.taskMembers?.push(action.payload);

      const taskMembersForDelete = state.taskMembersForDelete.filter(
        (employeeId) => employeeId !== action.payload.employee.id
      );
      state.taskMembersForDelete = taskMembersForDelete;
    },
    addTaskMembers(state, action: PayloadAction<ITaskMember[]>) {
      state.task.taskMembers?.push(...action.payload);
      state.taskMembersForDelete = [];
    },
    addTaskMemberForCreateByEmployeeId(state, action: PayloadAction<number>) {
      state.taskMembersForCreate.push(action.payload);
    },
    addTaskMembersForCreateByEmployeeIds(
      state,
      action: PayloadAction<number[]>
    ) {
      state.taskMembersForCreate.push(...action.payload);
    },
    deleteTaskMemberByEmployeeId(state, action: PayloadAction<number>) {
      const taskMembers = state.task.taskMembers?.filter(
        (taskMember) => taskMember.employee.id !== action.payload
      );
      state.task.taskMembers = taskMembers;

      const taskMembersForCreate = state.taskMembersForCreate.filter(
        (employeeId) => employeeId !== action.payload
      );
      state.taskMembersForCreate = taskMembersForCreate;
    },
    deleteTaskMembers(state) {
      state.task.taskMembers = [];
      state.taskMembersForCreate = [];
    },
    addTaskMemberForDeleteByEmployeeId(state, action: PayloadAction<number>) {
      state.taskMembersForDelete.push(action.payload);
    },
    addTaskMembersForDeleteByEmployeeIds(
      state,
      action: PayloadAction<number[]>
    ) {
      state.taskMembersForDelete.push(...action.payload);
    },
    setForceUpdate(state, action: PayloadAction<boolean>) {
      state.forceUpdate = action.payload;
    },
    setFilterState(state, action: PayloadAction<ITasksFilterState>) {
      state.filterState = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setActiveStatus(state, action: PayloadAction<number>) {
      state.activeStatus = action.payload;
    },
    setActiveSidebarIndex(state, action: PayloadAction<number>) {
      state.activeSidebarIndex = action.payload;
    },
    setSidebarIsOpen(state, action: PayloadAction<boolean>) {
      state.sidebarIsOpen = action.payload;
    },
    addTaskSubtask(state, action: PayloadAction<ITaskSubtask>) {
      state.task.taskSubtasks?.push(action.payload);
    },
    editTaskSubtaskById(state, action: PayloadAction<Partial<ITaskSubtask>>) {
      const taskSubtasks = state.task.taskSubtasks?.map((taskSubtask) =>
        taskSubtask.id === action.payload.id
          ? { ...taskSubtask, ...action.payload }
          : taskSubtask
      );
      state.task.taskSubtasks = taskSubtasks;
    },
    deleteTaskSubtask(state, action: PayloadAction<number | string>) {
      const taskSubtasks = state.task.taskSubtasks?.filter(
        (taskSubtask) => taskSubtask.id !== action.payload
      );
      state.task.taskSubtasks = taskSubtasks;

      const taskSubtasksForCreate = state.taskSubtasksForCreate.filter(
        (taskSubtask) => taskSubtask.id !== action.payload
      );
      state.taskSubtasksForCreate = taskSubtasksForCreate;
    },
    addTaskSubtaskForCreate(state, action: PayloadAction<ITaskSubtask>) {
      state.taskSubtasksForCreate.push(action.payload);
    },
    editTaskSubtaskForCreate(
      state,
      action: PayloadAction<{ id: number | string; text: string }>
    ) {
      const taskSubtasks = state.taskSubtasksForCreate.map((taskSubtask) =>
        taskSubtask.id === action.payload.id
          ? { ...taskSubtask, text: action.payload.text }
          : taskSubtask
      );
      state.taskSubtasksForCreate = taskSubtasks;
    },
    editTaskSubtaskForUpdate(
      state,
      action: PayloadAction<{ id: number; text: string }>
    ) {
      const isAdded = state.taskSubtasksForUpdate.some(
        (taskSubtask) => taskSubtask.id === action.payload.id
      );
      if (isAdded) {
        const taskSubtasks = state.taskSubtasksForUpdate.map((taskSubtask) =>
          taskSubtask.id === action.payload.id
            ? { ...taskSubtask, text: action.payload.text }
            : taskSubtask
        );
        state.taskSubtasksForUpdate = taskSubtasks;
      } else {
        state.taskSubtasksForUpdate.push(action.payload);
      }
    },
    addTaskSubtaskIdForDelete(state, action: PayloadAction<number>) {
      state.taskSubtasksForDelete.push(action.payload);
    },
    clearState() {
      return initialState;
    },
  },
});

export const taskActions = taskSlice.actions;
export default taskSlice.reducer;
