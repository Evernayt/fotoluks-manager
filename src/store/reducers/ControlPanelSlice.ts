import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_FILTER } from 'constants/states/filter-states';
import { IUsersFilter } from 'models/api/IUser';
import { IProductsFilter } from 'models/api/IProduct';
import { ITypesFilter } from 'models/api/IType';
import { ICategoriesFilter } from 'models/api/ICategory';
import { IFeaturesFilter } from 'models/api/IFeature';
import { IParamsFilter } from 'models/api/IParam';
import { IShopsFilter } from 'models/api/IShop';
import { IEmployeesFilter } from 'models/api/IEmployee';

interface ActiveFilterProps<K = keyof Filters> {
  filter: K;
  //@ts-ignore
  props?: Filters[K];
}

type Filters = {
  usersFilter: IUsersFilter;
  typesFilter: ITypesFilter;
  productsFilter: IProductsFilter;
  categoriesFilter: ICategoriesFilter;
  featuresFilter: IFeaturesFilter;
  paramsFilter: IParamsFilter;
  shopsFilter: IShopsFilter;
  employeesFilter: IEmployeesFilter;
};

type ControlPanelState = Filters & {
  activeTableId: number;
  forceUpdate: boolean;
  isLoading: boolean;
  search: string;
  disableFilter: boolean;
};

const initialState: ControlPanelState = {
  activeTableId: 1,
  forceUpdate: false,
  isLoading: false,
  search: '',
  disableFilter: false,
  usersFilter: INITIAL_FILTER,
  typesFilter: INITIAL_FILTER,
  productsFilter: INITIAL_FILTER,
  categoriesFilter: INITIAL_FILTER,
  featuresFilter: INITIAL_FILTER,
  paramsFilter: INITIAL_FILTER,
  shopsFilter: INITIAL_FILTER,
  employeesFilter: INITIAL_FILTER,
};

export const controlPanelSlice = createSlice({
  name: 'controlPanel',
  initialState,
  reducers: {
    setActiveTableId(state, action: PayloadAction<number>) {
      state.activeTableId = action.payload;
    },
    setForceUpdate(state, action: PayloadAction<boolean>) {
      state.forceUpdate = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    activeFilter(state, action: PayloadAction<ActiveFilterProps>) {
      state[action.payload.filter] = {
        ...action.payload.props,
        isActive: true,
        isPendingDeactivation: false,
      };
    },
    deactiveFilter(state, action: PayloadAction<keyof Filters>) {
      state[action.payload] = INITIAL_FILTER;
    },
    clearFilter(state, action: PayloadAction<keyof Filters>) {
      state[action.payload] = {
        ...INITIAL_FILTER,
        isPendingDeactivation: true,
      };
    },
    setDisableFilter(state, action: PayloadAction<boolean>) {
      state.disableFilter = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export default controlPanelSlice.reducer;
