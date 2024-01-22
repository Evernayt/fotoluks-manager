import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IEmployeesFilterState,
  INITIAL_EMPLOYEES_FILTER_STATE,
} from 'pages/control-page/modals/employees/filter-modal/EmployeesFilterModal';
import {
  INITIAL_PRODUCTS_FILTER_STATE,
  IProductsFilterState,
} from 'pages/control-page/modals/products/filter-modal/ProductsFilterModal';
import {
  INITIAL_SHOPS_FILTER_STATE,
  IShopsFilterState,
} from 'pages/control-page/modals/shops/filter-modal/ShopsFilterModal';
import {
  INITIAL_USERS_FILTER_STATE,
  IUsersFilterState,
} from 'pages/control-page/modals/users/filter-modal/UsersFilterModal';

type ControlState = {
  activeSidebarIndex: number;
  sidebarIsOpen: boolean;
  forceUpdate: boolean;
  isLoading: boolean;
  search: string;
  productsFilterState: IProductsFilterState;
  usersFilterState: IUsersFilterState;
  employeesFilterState: IEmployeesFilterState;
  shopsFilterState: IShopsFilterState;
};

const initialState: ControlState = {
  activeSidebarIndex: 0,
  sidebarIsOpen: true,
  forceUpdate: false,
  isLoading: false,
  search: '',
  productsFilterState: INITIAL_PRODUCTS_FILTER_STATE,
  usersFilterState: INITIAL_USERS_FILTER_STATE,
  employeesFilterState: INITIAL_EMPLOYEES_FILTER_STATE,
  shopsFilterState: INITIAL_SHOPS_FILTER_STATE,
};

export const controlSlice = createSlice({
  name: 'control',
  initialState,
  reducers: {
    setActiveSidebarIndex(state, action: PayloadAction<number>) {
      state.activeSidebarIndex = action.payload;
    },
    setSidebarIsOpen(state, action: PayloadAction<boolean>) {
      state.sidebarIsOpen = action.payload;
    },
    setForceUpdate(state, action: PayloadAction<boolean>) {
      state.forceUpdate = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setProductsFilterState(state, action: PayloadAction<IProductsFilterState>) {
      state.productsFilterState = action.payload;
    },
    setUsersFilterState(state, action: PayloadAction<IUsersFilterState>) {
      state.usersFilterState = action.payload;
    },
    setEmployeesFilterState(
      state,
      action: PayloadAction<IEmployeesFilterState>
    ) {
      state.employeesFilterState = action.payload;
    },
    setShopsFilterState(state, action: PayloadAction<IShopsFilterState>) {
      state.shopsFilterState = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const controlActions = controlSlice.actions;
export default controlSlice.reducer;
