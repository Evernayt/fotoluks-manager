import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Themes } from 'constants/app';
import { initialShop } from 'constants/InitialStates/initialShopState';
import { THEME_KEY } from 'constants/localStorage';
import { ORDERS_ROUTE } from 'constants/paths';
import { GlobalMessageVariants, IGlobalMessage } from 'models/IGlobalMessage';
import { IShop } from 'models/IShop';
import { ITheme } from 'models/ITheme';

type AppState = {
  activeRoute: string;
  activeShop: IShop;
  globalMessage: IGlobalMessage;
  notificationsBadge: boolean;
  mainFolder: string;
  theme: ITheme;
};

const initialState: AppState = {
  activeRoute: ORDERS_ROUTE,
  activeShop: initialShop,
  globalMessage: {
    message: '',
    variant: GlobalMessageVariants.success,
    isShowing: false,
  },
  notificationsBadge: false,
  mainFolder: '',
  theme: localStorage.getItem(THEME_KEY)
    ? JSON.parse(localStorage.getItem(THEME_KEY) || '{}')
    : Themes[0],
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActiveRoute(state, action: PayloadAction<string>) {
      state.activeRoute = action.payload;
    },
    setActiveShop(state, action: PayloadAction<IShop>) {
      state.activeShop = action.payload;
    },
    showGlobalMessage(state, action: PayloadAction<IGlobalMessage>) {
      state.globalMessage = action.payload;
    },
    setNoificationsBadge(state, action: PayloadAction<boolean>) {
      state.notificationsBadge = action.payload;
    },
    setMainFolder(state, action: PayloadAction<string>) {
      state.mainFolder = action.payload;
    },
    setTheme(state, action: PayloadAction<ITheme>) {
      state.theme = action.payload;
    },
  },
});

export const {
  setActiveRoute,
  setActiveShop,
  showGlobalMessage,
  setNoificationsBadge,
  setMainFolder,
  setTheme,
} = appSlice.actions;

export default appSlice.reducer;
