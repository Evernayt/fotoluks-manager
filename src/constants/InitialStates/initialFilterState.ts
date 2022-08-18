import { ICategoriesFilter } from 'models/ICategory';
import { IFilter } from 'models/IFilter';
import { IOrdersFilter } from 'models/IOrder';
import { IProductsFilter } from 'models/IProduct';
import { ITypesFilter } from 'models/IType';
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
  userRole: initialRole,
};

export const initialTypesFilter: ITypesFilter = {
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

export const initialProductsFilter: IProductsFilter = {
  filter: initialFilter,
};

export const initialCategoriesFilter: ICategoriesFilter = {
  filter: initialFilter,
};
