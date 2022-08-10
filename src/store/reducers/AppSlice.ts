import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialShop } from 'constants/InitialStates/initialShopState';
import { ORDERS_ROUTE } from 'constants/paths';
import { IShop } from 'models/IShop';

type AppState = {
  activeRoute: string;
  activeShop: IShop;
};

const initialState: AppState = {
  activeRoute: ORDERS_ROUTE,
  activeShop: initialShop,
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
  },
});

export const { setActiveRoute, setActiveShop } = appSlice.actions;

export default appSlice.reducer;
