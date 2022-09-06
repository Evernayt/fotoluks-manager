import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialFoundCategories } from 'constants/InitialStates/initialCategoryState';
import {
  initialCategoriesFilter,
  initialProductsFilter,
  initialTypesFilter,
  initialUserFilter,
} from 'constants/InitialStates/initialFilterState';
import { initialFoundProducts } from 'constants/InitialStates/initialProductState';
import { initialFoundTypes } from 'constants/InitialStates/initialTypeState';
import { initialFoundUsers } from 'constants/InitialStates/initialUserState';
import { ICategoriesFilter, IFoundCategories } from 'models/ICategory';
import { IFoundProducts, IProductsFilter } from 'models/IProduct';
import { IFoundTypes, ITypesFilter } from 'models/IType';
import { IFoundUsers, IRole, IUsersFilter } from 'models/IUser';

type ControlPanelState = {
  isMinimizedSidemenu: boolean;
  activeItemId: number;
  forceUpdate: boolean;
  isLoading: boolean;
  usersFilter: IUsersFilter;
  typesFilter: ITypesFilter;
  foundUsers: IFoundUsers;
  foundTypes: IFoundTypes;
  productsFilter: IProductsFilter;
  foundProducts: IFoundProducts;
  categoriesFilter: ICategoriesFilter;
  foundCategories: IFoundCategories;
};

const initialState: ControlPanelState = {
  isMinimizedSidemenu: true,
  activeItemId: 1,
  forceUpdate: false,
  isLoading: false,
  usersFilter: initialUserFilter,
  typesFilter: initialTypesFilter,
  foundUsers: initialFoundUsers,
  foundTypes: initialFoundTypes,
  productsFilter: initialProductsFilter,
  foundProducts: initialFoundProducts,
  categoriesFilter: initialCategoriesFilter,
  foundCategories: initialFoundCategories,
};

export const controlPanelSlice = createSlice({
  name: 'controlPanel',
  initialState,
  reducers: {
    setIsMinimizedSidemenu(state, action: PayloadAction<boolean>) {
      state.isMinimizedSidemenu = action.payload;
    },
    setActiveItemId(state, action: PayloadAction<number>) {
      state.activeItemId = action.payload;
    },
    setForceUpdate(state, action: PayloadAction<boolean>) {
      state.forceUpdate = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    activeUsersFilter(state, action: PayloadAction<IUsersFilter>) {
      state.usersFilter = {
        filter: {
          isActive: true,
          isPendingDeactivation: false,
        },
        userRole: action.payload.userRole,
        shopId: action.payload.shopId,
        archive: action.payload.archive,
      };
    },
    deactiveUsersFilter(state) {
      state.usersFilter = initialUserFilter;
    },
    clearUsersFilter(state) {
      state.usersFilter = initialUserFilter;
      state.usersFilter.filter.isPendingDeactivation = true;
    },
    activeTypesFilter(state, action: PayloadAction<{ role: IRole }>) {
      // state.usersFilter = {
      //   filter: {
      //     isActive: true,
      //     isPendingDeactivation: false,
      //   },
      //   ...action.payload,
      // };
    },
    deactiveTypesFilter(state) {
      state.typesFilter = initialTypesFilter;
    },
    clearTypesFilter(state) {
      state.typesFilter = initialTypesFilter;
      state.typesFilter.filter.isPendingDeactivation = true;
    },
    setFoundUsers(state, action: PayloadAction<IFoundUsers>) {
      state.foundUsers = action.payload;
    },
    setFoundTypes(state, action: PayloadAction<IFoundTypes>) {
      state.foundTypes = action.payload;
    },
    activeProductsFilter(state, action: PayloadAction<{ role: IRole }>) {
      // state.usersFilter = {
      //   filter: {
      //     isActive: true,
      //     isPendingDeactivation: false,
      //   },
      //   ...action.payload,
      // };
    },
    deactiveProductsFilter(state) {
      state.productsFilter = initialProductsFilter;
    },
    clearProductsFilter(state) {
      state.productsFilter = initialProductsFilter;
      state.productsFilter.filter.isPendingDeactivation = true;
    },
    setFoundProducts(state, action: PayloadAction<IFoundProducts>) {
      state.foundProducts = action.payload;
    },
    activeCategoriesFilter(state, action: PayloadAction<ICategoriesFilter>) {
      state.categoriesFilter = {
        filter: {
          isActive: true,
          isPendingDeactivation: false,
        },
        archive: action.payload.archive,
      };
    },
    deactiveCategoriesFilter(state) {
      state.categoriesFilter = initialCategoriesFilter;
    },
    clearCategoriesFilter(state) {
      state.categoriesFilter = initialCategoriesFilter;
      state.categoriesFilter.filter.isPendingDeactivation = true;
    },
    setFoundCategories(state, action: PayloadAction<IFoundCategories>) {
      state.foundCategories = action.payload;
    },
  },
});

export const {
  setIsMinimizedSidemenu,
  setActiveItemId,
  setForceUpdate,
  setIsLoading,
  activeUsersFilter,
  deactiveUsersFilter,
  clearUsersFilter,
  activeTypesFilter,
  deactiveTypesFilter,
  clearTypesFilter,
  setFoundUsers,
  setFoundTypes,
  activeProductsFilter,
  deactiveProductsFilter,
  clearProductsFilter,
  setFoundProducts,
  activeCategoriesFilter,
  deactiveCategoriesFilter,
  clearCategoriesFilter,
  setFoundCategories,
} = controlPanelSlice.actions;

export default controlPanelSlice.reducer;
