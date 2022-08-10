import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  initialCategoriesFilter,
  initialUserFilter,
} from 'constants/InitialStates/initialFilterState';
import { initialFoundUsers } from 'constants/InitialStates/initialUserState';
import { ICategoriesFilter } from 'models/ICategory';
import { IFoundUsers, IRole, IUsersFilter } from 'models/IUser';

type ControlPanelState = {
  isMinimizedSidemenu: boolean;
  activeItemId: number;
  forceUpdate: boolean;
  isLoading: boolean;
  usersFilter: IUsersFilter;
  categoriesFilter: ICategoriesFilter;
  foundUsers: IFoundUsers;
};

const initialState: ControlPanelState = {
  isMinimizedSidemenu: true,
  activeItemId: 1,
  forceUpdate: false,
  isLoading: false,
  usersFilter: initialUserFilter,
  categoriesFilter: initialCategoriesFilter,
  foundUsers: initialFoundUsers,
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
    activeUsersFilter(state, action: PayloadAction<{ role: IRole }>) {
      state.usersFilter = {
        filter: {
          isActive: true,
          isPendingDeactivation: false,
        },
        ...action.payload,
      };
    },
    deactiveUsersFilter(state) {
      state.usersFilter = initialUserFilter;
    },
    clearUsersFilter(state) {
      state.usersFilter = initialUserFilter;
      state.usersFilter.filter.isPendingDeactivation = true;
    },
    activeCategoriesFilter(state, action: PayloadAction<{ role: IRole }>) {
      // state.usersFilter = {
      //   filter: {
      //     isActive: true,
      //     isPendingDeactivation: false,
      //   },
      //   ...action.payload,
      // };
    },
    deactiveCategoriesFilter(state) {
      state.categoriesFilter = initialCategoriesFilter;
    },
    clearCategoriesFilter(state) {
      state.categoriesFilter = initialCategoriesFilter;
      state.categoriesFilter.filter.isPendingDeactivation = true;
    },
    setFoundUsers(state, action: PayloadAction<IFoundUsers>) {
      state.foundUsers = action.payload;
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
  activeCategoriesFilter,
  deactiveCategoriesFilter,
  clearCategoriesFilter,
  setFoundUsers,
} = controlPanelSlice.actions;

export default controlPanelSlice.reducer;
