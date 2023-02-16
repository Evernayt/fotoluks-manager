import { configureStore } from '@reduxjs/toolkit';
import AppSlice from './reducers/AppSlice';
import ControlPanelSlice from './reducers/ControlPanelSlice';
import EmployeeSlice from './reducers/EmployeeSlice';
import LossSlice from './reducers/LossSlice';
import ModalSlice from './reducers/ModalSlice';
import MoveSlice from './reducers/MoveSlice';
import MoyskladSlice from './reducers/MoyskladSlice';
import OrderSlice from './reducers/OrderSlice';

const store = configureStore({
  reducer: {
    app: AppSlice,
    modal: ModalSlice,
    employee: EmployeeSlice,
    order: OrderSlice,
    controlPanel: ControlPanelSlice,
    loss: LossSlice,
    moysklad: MoyskladSlice,
    move: MoveSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
