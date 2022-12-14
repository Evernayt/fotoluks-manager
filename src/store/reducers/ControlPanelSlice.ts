import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialFoundCategories } from 'constants/InitialStates/initialCategoryState';
import { initialFoundFeatures } from 'constants/InitialStates/initialFeatureState';
import {
  initialCategoriesFilter,
  initialFeaturesFilter,
  initialParamsFilter,
  initialProductsFilter,
  initialShopsFilter,
  initialTypesFilter,
  initialUserFilter,
} from 'constants/InitialStates/initialFilterState';
import { initialFoundParams } from 'constants/InitialStates/initialParamState';
import { initialFoundProducts } from 'constants/InitialStates/initialProductState';
import { initialFoundShops } from 'constants/InitialStates/initialShopState';
import { initialFoundTypes } from 'constants/InitialStates/initialTypeState';
import { initialFoundUsers } from 'constants/InitialStates/initialUserState';
import { ICategoriesFilter, IFoundCategories } from 'models/ICategory';
import { IFeaturesFilter, IFoundFeatures } from 'models/IFeature';
import { IFoundParams, IParamsFilter } from 'models/IParam';
import { IFoundProducts, IProductsFilter } from 'models/IProduct';
import { IFoundShops, IShopsFilter } from 'models/IShop';
import { IFoundTypes, ITypesFilter } from 'models/IType';
import { IFoundUsers, IUsersFilter } from 'models/IUser';

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
  featuresFilter: IFeaturesFilter;
  foundFeatures: IFoundFeatures;
  paramsFilter: IParamsFilter;
  foundParams: IFoundParams;
  shopsFilter: IShopsFilter;
  foundShops: IFoundShops;
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
  featuresFilter: initialFeaturesFilter,
  foundFeatures: initialFoundFeatures,
  paramsFilter: initialParamsFilter,
  foundParams: initialFoundParams,
  shopsFilter: initialShopsFilter,
  foundShops: initialFoundShops,
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
    activeTypesFilter(state, action: PayloadAction<ITypesFilter>) {
      state.typesFilter = {
        filter: {
          isActive: true,
          isPendingDeactivation: false,
        },
        archive: action.payload.archive,
      };
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
    activeProductsFilter(state, action: PayloadAction<IProductsFilter>) {
      state.productsFilter = {
        filter: {
          isActive: true,
          isPendingDeactivation: false,
        },
        archive: action.payload.archive,
      };
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
    activeFeaturesFilter(state, action: PayloadAction<IFeaturesFilter>) {
      state.featuresFilter = {
        filter: {
          isActive: true,
          isPendingDeactivation: false,
        },
        archive: action.payload.archive,
      };
    },
    deactiveFeaturesFilter(state) {
      state.featuresFilter = initialFeaturesFilter;
    },
    clearFeaturesFilter(state) {
      state.featuresFilter = initialFeaturesFilter;
      state.featuresFilter.filter.isPendingDeactivation = true;
    },
    setFoundFeatures(state, action: PayloadAction<IFoundFeatures>) {
      state.foundFeatures = action.payload;
    },
    activeParamsFilter(state, action: PayloadAction<IParamsFilter>) {
      state.paramsFilter = {
        filter: {
          isActive: true,
          isPendingDeactivation: false,
        },
        archive: action.payload.archive,
      };
    },
    deactiveParamsFilter(state) {
      state.paramsFilter = initialParamsFilter;
    },
    clearParamsFilter(state) {
      state.paramsFilter = initialParamsFilter;
      state.paramsFilter.filter.isPendingDeactivation = true;
    },
    setFoundParams(state, action: PayloadAction<IFoundParams>) {
      state.foundParams = action.payload;
    },
    activeShopsFilter(state, action: PayloadAction<IShopsFilter>) {
      state.shopsFilter = {
        filter: {
          isActive: true,
          isPendingDeactivation: false,
        },
        archive: action.payload.archive,
      };
    },
    deactiveShopsFilter(state) {
      state.shopsFilter = initialShopsFilter;
    },
    clearShopsFilter(state) {
      state.shopsFilter = initialShopsFilter;
      state.shopsFilter.filter.isPendingDeactivation = true;
    },
    setFoundShops(state, action: PayloadAction<IFoundShops>) {
      state.foundShops = action.payload;
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
  activeFeaturesFilter,
  deactiveFeaturesFilter,
  clearFeaturesFilter,
  setFoundFeatures,
  activeParamsFilter,
  deactiveParamsFilter,
  clearParamsFilter,
  setFoundParams,
  activeShopsFilter,
  deactiveShopsFilter,
  clearShopsFilter,
  setFoundShops,
} = controlPanelSlice.actions;

export default controlPanelSlice.reducer;
