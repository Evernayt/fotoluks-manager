import { IShop } from 'models/api/IShop';
import { IFilter } from 'models/IFilter';
import { INITIAL_FILTER } from 'constants/states/filter-states';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITask, ITasksFilter } from 'models/api/ITask';
import { INITIAL_TASK } from 'constants/states/task-states';
import { ITaskMember } from 'models/api/ITaskMember';
import { IDepartment } from 'models/api/IDepartment';
import { ITaskMessage } from 'models/api/ITaskMessage';
import { ALL_SHOPS } from 'constants/states/shop-states';
import { ALL_DEPARTMENTS } from 'constants/states/department-states';
import { ITaskSubtask } from 'models/api/ITaskSubtask';
import { UpdateTaskSubtaskDto } from 'api/TaskSubtaskAPI/dto/update-task-subtask.dto';

type TaskState = {
  tasks: ITask[];
  task: ITask;
  beforeTask: ITask;
  taskMessages: ITaskMessage[];
  taskMembersForCreate: number[];
  taskMembersForDelete: number[];
  haveUnsavedData: boolean;
  forceUpdate: boolean;
  filter: IFilter;
  disableFilter: boolean;
  isLoading: boolean;
  search: string;
  activeStatus: number;
  activeSidemenuIndex: number;
  selectedShop: IShop;
  selectedDepartment: IDepartment;
  iTaskMember: boolean;
  iTaskCreator: boolean;
  archive: boolean;
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
  filter: INITIAL_FILTER,
  disableFilter: false,
  isLoading: true,
  search: '',
  activeStatus: 0,
  activeSidemenuIndex: 0,
  selectedShop: ALL_SHOPS,
  selectedDepartment: ALL_DEPARTMENTS,
  iTaskMember: false,
  iTaskCreator: false,
  archive: false,
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
    setName(state, action: PayloadAction<string>) {
      state.task.name = action.payload;
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
    setTaskMessages(state, action: PayloadAction<ITaskMessage[]>) {
      state.taskMessages = action.payload;
    },
    addTaskMessage(state, action: PayloadAction<ITaskMessage>) {
      state.taskMessages.push(action.payload);
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
    },
    addTaskMembers(state, action: PayloadAction<ITaskMember[]>) {
      state.task.taskMembers?.push(...action.payload);
    },
    addTaskMemberForCreate(state, action: PayloadAction<number>) {
      state.taskMembersForCreate.push(action.payload);
    },
    addTaskMembersForCreate(state, action: PayloadAction<number[]>) {
      state.taskMembersForCreate.push(...action.payload);
    },
    deleteTaskMemberByEmployeeId(state, action: PayloadAction<number>) {
      const taskMembers = state.task.taskMembers?.filter(
        (taskMember) => taskMember.employee.id !== action.payload
      );
      state.task.taskMembers = taskMembers;
    },
    deleteTaskMembers(state) {
      state.task.taskMembers = [];
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
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    activeFilter(state, action: PayloadAction<ITasksFilter>) {
      state.filter = {
        ...action.payload,
        isActive: true,
        isPendingDeactivation: false,
      };
    },
    deactiveFilter(state) {
      state.filter = INITIAL_FILTER;
    },
    clearFilter(state) {
      state.filter = { ...INITIAL_FILTER, isPendingDeactivation: true };
    },
    setDisableFilter(state, action: PayloadAction<boolean>) {
      state.disableFilter = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setActiveStatus(state, action: PayloadAction<number>) {
      state.activeStatus = action.payload;
    },
    setActiveSidemenuIndex(state, action: PayloadAction<number>) {
      state.activeSidemenuIndex = action.payload;
    },
    setSelectedShop(state, action: PayloadAction<IShop>) {
      state.selectedShop = action.payload;
    },
    setSelectedDepartment(state, action: PayloadAction<IDepartment>) {
      state.selectedDepartment = action.payload;
    },
    setITaskMember(state, action: PayloadAction<boolean>) {
      state.iTaskMember = action.payload;
    },
    setITaskCreator(state, action: PayloadAction<boolean>) {
      state.iTaskCreator = action.payload;
    },
    setArchive(state, action: PayloadAction<boolean>) {
      state.archive = action.payload;
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

export default taskSlice.reducer;
