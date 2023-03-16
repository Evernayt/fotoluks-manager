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
    },
    clearTask(state) {
      state.task = INITIAL_TASK;
      state.beforeTask = INITIAL_TASK;
      state.taskMembersForCreate = [];
      state.taskMembersForDelete = [];
    },
    saveTask(state, action: PayloadAction<ITask>) {
      state.beforeTask = action.payload;
      state.taskMembersForCreate = [];
      state.taskMembersForDelete = [];
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
    clearState() {
      return initialState;
    },
  },
});

export default taskSlice.reducer;
