import { IUpdate } from './../../models/IUpdate';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  INITIAL_CHECK_UPDATE,
  INITIAL_DOWNLOAD_UPDATE,
  INITIAL_SHOP,
} from 'constants/initialStates';
import { IOnlineEmployee } from 'models/IOnlineEmployee';
import { IApp } from 'models/api/IApp';
import { IDepartment } from 'models/api/IDepartment';
import { IRole } from 'models/api/IRole';
import { IShop } from 'models/api/IShop';

type AppState = {
  shops: IShop[];
  shopsWithGeneral: IShop[];
  roles: IRole[];
  apps: IApp[];
  departments: IDepartment[];
  departmentsWithGeneral: IDepartment[];
  activeShop: IShop;
  notificationsBadge: boolean;
  onlineEmployees: IOnlineEmployee[];
  checkUpdate: IUpdate;
  downloadUpdate: IUpdate;
  version: string;
  downloadingProgress: number;
};

const initialState: AppState = {
  shops: [],
  shopsWithGeneral: [],
  roles: [],
  apps: [],
  departments: [],
  departmentsWithGeneral: [],
  activeShop: INITIAL_SHOP,
  notificationsBadge: false,
  onlineEmployees: [],
  checkUpdate: INITIAL_CHECK_UPDATE,
  downloadUpdate: INITIAL_DOWNLOAD_UPDATE,
  version: '0',
  downloadingProgress: 0,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setShops(state, action: PayloadAction<IShop[]>) {
      state.shops = action.payload;
    },
    setShopsWithGeneral(state, action: PayloadAction<IShop[]>) {
      state.shopsWithGeneral = action.payload;
    },
    setRoles(state, action: PayloadAction<IRole[]>) {
      state.roles = action.payload;
    },
    setApps(state, action: PayloadAction<IApp[]>) {
      state.apps = action.payload;
    },
    setDepartments(state, action: PayloadAction<IDepartment[]>) {
      state.departments = action.payload;
    },
    setDepartmentsWithGeneral(state, action: PayloadAction<IDepartment[]>) {
      state.departmentsWithGeneral = action.payload;
    },
    setActiveShop(state, action: PayloadAction<IShop>) {
      state.activeShop = action.payload;
    },
    setNoificationsBadge(state, action: PayloadAction<boolean>) {
      state.notificationsBadge = action.payload;
    },
    setOnlineEmployees(state, action: PayloadAction<IOnlineEmployee[]>) {
      state.onlineEmployees = action.payload;
    },
    setCheckUpdate(state, action: PayloadAction<IUpdate>) {
      state.checkUpdate.pending = action.payload.pending || false;
      state.checkUpdate.success = action.payload.success || false;
      state.checkUpdate.failure = action.payload.failure || false;
    },
    setDownloadUpdate(state, action: PayloadAction<IUpdate>) {
      state.downloadUpdate.pending = action.payload.pending || false;
      state.downloadUpdate.success = action.payload.success || false;
      state.downloadUpdate.failure = action.payload.failure || false;
    },
    setVersion(state, action: PayloadAction<string>) {
      state.version = action.payload;
    },
    setDownloadingProgress(state, action: PayloadAction<number>) {
      state.downloadingProgress = action.payload;
    },
    clearState(state) {
      state.notificationsBadge = initialState.notificationsBadge;
      state.onlineEmployees = initialState.onlineEmployees;
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
