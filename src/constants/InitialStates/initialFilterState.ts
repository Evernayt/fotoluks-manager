import { ICategoriesFilter } from 'models/ICategory';
import { IFilter } from 'models/IFilter';
import { IOrdersFilter } from 'models/IOrder';
import { IRole, IUsersFilter } from 'models/IUser';

export const initialFilter: IFilter = {
  isActive: false,
  isPendingDeactivation: false,
};

export const initialRole: IRole = {
  id: -1,
  name: 'Все роли',
  role: null,
};

export const initialUserFilter: IUsersFilter = {
  filter: initialFilter,
  role: initialRole,
};

export const initialCategoriesFilter: ICategoriesFilter = {
  filter: initialFilter,
};

export const initialOrdersFilter: IOrdersFilter = {
  filter: initialFilter,
  shop: {
    id: 0,
    name: '',
    address: '',
    description: '',
  },
  startDate: '',
  endDate: '',
};
