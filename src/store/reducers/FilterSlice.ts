import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_FILTER } from 'constants/initialStates';
import { IEmployeesFilter } from 'models/api/IEmployee';
import { IOrdersFilter } from 'models/api/IOrder';
import { IProductsFilter } from 'models/api/IProduct';
import { IShopsFilter } from 'models/api/IShop';
import { ITasksFilter } from 'models/api/ITask';
import { IUsersFilter } from 'models/api/IUser';

type FilterState = {
  ordersFilter: IOrdersFilter;
  productsFilter: IProductsFilter;
  usersFilter: IUsersFilter;
  employeesFilter: IEmployeesFilter;
  shopsFilter: IShopsFilter;
  tasksFilter: ITasksFilter;
};

const initialState: FilterState = {
  ordersFilter: INITIAL_FILTER,
  productsFilter: INITIAL_FILTER,
  usersFilter: INITIAL_FILTER,
  employeesFilter: INITIAL_FILTER,
  shopsFilter: INITIAL_FILTER,
  tasksFilter: INITIAL_FILTER,
};

interface ActiveFilterProps<K = keyof FilterState> {
  filter: K;
  //@ts-ignore
  props?: FilterState[K];
}

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    activeFilter(state, action: PayloadAction<ActiveFilterProps>) {
      state[action.payload.filter] = {
        ...action.payload.props,
        isActive: true,
        isPendingDeactivation: false,
      };
    },
    deactiveFilter(state, action: PayloadAction<keyof FilterState>) {
      state[action.payload] = initialState[action.payload];
    },
    clearFilter(state, action: PayloadAction<keyof FilterState>) {
      state[action.payload] = {
        ...initialState[action.payload],
        isPendingDeactivation: true,
      };
    },
  },
});

export const filterActions = filterSlice.actions;
export default filterSlice.reducer;
