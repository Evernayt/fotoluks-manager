import { IFilter } from 'models/IFilter';
import { IModal } from 'models/IModal';
import { IUpdate } from 'models/IUpdate';
import { IChatMessage } from 'models/api/IChatMessage';
import { IDepartment } from 'models/api/IDepartment';
import { IOrder } from 'models/api/IOrder';
import { IRole } from 'models/api/IRole';
import { IShop } from 'models/api/IShop';
import { IStatus } from 'models/api/IStatus';
import { ITask } from 'models/api/ITask';
import moment from 'moment';

const INITIAL_CHECK_UPDATE: IUpdate = {
  pending: true,
  success: false,
  failure: false,
};
const INITIAL_DOWNLOAD_UPDATE: IUpdate = {
  pending: false,
  success: false,
  failure: false,
};
const INITIAL_SHOP: IShop = {
  id: 0,
  name: '',
  address: '',
  description: '',
  abbreviation: '',
  archive: false,
};
const INITIAL_MODAL: IModal = { isOpen: false };
const INITIAL_FILTER: IFilter = {
  isActive: false,
  isPendingDeactivation: false,
};
const ALL_SHOPS: IShop = {
  ...INITIAL_SHOP,
  name: 'Все филиалы',
};
const ALL_DEPARTMENTS: IDepartment = {
  id: 0,
  name: 'Все отделы',
  archive: false,
};
const ALL_ROLES: IRole = {
  id: 0,
  name: 'Все роли',
  accessLevel: 0,
};
const INITIAL_ORDER: IOrder = {
  id: 0,
  createdAt: '',
  deadline: moment().add(3, 'days').toISOString(),
  prepayment: 0,
  sum: 0,
  discount: 0,
  comment: '',
  user: null,
  orderProducts: [],
  orderMembers: [],
  orderFiles: [],
};
const INITIAL_STATUS: IStatus = {
  id: 0,
  name: 'Все заказы',
  color: '',
};
const INITIAL_TASK: ITask = {
  id: 0,
  title: '',
  description: '',
  urgent: false,
  personal: false,
  createdAt: '',
  completed: false,
  completedDate: '',
  completionNote: '',
  archive: false,
  shop: null,
  department: null,
  taskMembers: [],
  taskMessages: [],
  taskSubtasks: [],
};

export {
  INITIAL_CHECK_UPDATE,
  INITIAL_DOWNLOAD_UPDATE,
  INITIAL_SHOP,
  INITIAL_MODAL,
  INITIAL_FILTER,
  ALL_SHOPS,
  ALL_DEPARTMENTS,
  ALL_ROLES,
  INITIAL_ORDER,
  INITIAL_STATUS,
  INITIAL_TASK,
};
