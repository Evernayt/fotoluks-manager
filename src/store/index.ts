import { configureStore } from '@reduxjs/toolkit';
import AppSlice from './reducers/AppSlice';
import ControlPanelSlice from './reducers/ControlPanelSlice';
import ModalSlice from './reducers/ModalSlice';
import OrderSlice from './reducers/OrderSlice';
import UserSlice from './reducers/UserSlice';

const store = configureStore({
  reducer: {
    app: AppSlice,
    modal: ModalSlice,
    user: UserSlice,
    order: OrderSlice,
    controlPanel: ControlPanelSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
