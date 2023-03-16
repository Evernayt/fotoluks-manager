import { ITask } from 'models/api/ITask';
import { INITIAL_DEPARTMENT } from './department-states';
import { INITIAL_SHOP } from './shop-states';

export const INITIAL_TASK: ITask = {
  id: 0,
  title: '',
  description: '',
  urgent: false,
  createdAt: '',
  completed: false,
  completedDate: '',
  archive: false,
  shop: INITIAL_SHOP,
  department: INITIAL_DEPARTMENT,
  taskMembers: [],
  taskMessages: [],
};
