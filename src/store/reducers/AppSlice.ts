import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialShop } from 'constants/InitialStates/initialShopState';
import { ORDERS_ROUTE } from 'constants/paths';
import { GlobalMessageVariants, IGlobalMessage } from 'models/IGlobalMessage';
import { IShop } from 'models/IShop';

type AppState = {
  activeRoute: string;
  activeShop: IShop;
  globalMessage: IGlobalMessage;
  notificationsBadge: boolean;
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
  },
});

export const {
  setActiveRoute,
  setActiveShop,
  showGlobalMessage,
  setNoificationsBadge,
} = appSlice.actions;

export default appSlice.reducer;
