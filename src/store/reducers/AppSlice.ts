import {
  INITIAL_CHECK_UPDATE,
  INITIAL_DOWNLOAD_UPDATE,
} from './../../constants/states/update-states';
import { IUpdate } from './../../models/IUpdate';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_SHOP } from 'constants/states/shop-states';
import { GlobalMessageVariants, IGlobalMessage } from 'models/IGlobalMessage';
import { IShop } from 'models/api/IShop';
import { ITheme } from 'models/ITheme';
import { getTheme } from 'helpers/localStorage';

type AppState = {
  shops: IShop[];
  activeShop: IShop;
  globalMessage: IGlobalMessage;
  notificationsBadge: boolean;
  theme: ITheme;
  checkUpdate: IUpdate;
  downloadUpdate: IUpdate;
};

const initialState: AppState = {
  shops: [],
  activeShop: INITIAL_SHOP,
  globalMessage: {
    message: '',
    variant: GlobalMessageVariants.success,
    isShowing: false,
  },
  notificationsBadge: false,
  theme: getTheme(),
  checkUpdate: INITIAL_CHECK_UPDATE,
  downloadUpdate: INITIAL_DOWNLOAD_UPDATE,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setShops(state, action: PayloadAction<IShop[]>) {
      state.shops = action.payload;
    },
    setActiveShop(state, action: PayloadAction<IShop>) {
      state.activeShop = action.payload;
    },
    setGlobalMessage(state, action: PayloadAction<IGlobalMessage>) {
      state.globalMessage = action.payload;
    },
    setNoificationsBadge(state, action: PayloadAction<boolean>) {
      state.notificationsBadge = action.payload;
    },
    setTheme(state, action: PayloadAction<ITheme>) {
      state.theme = action.payload;
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
  },
});

export default appSlice.reducer;
