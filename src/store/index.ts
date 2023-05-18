import { configureStore } from '@reduxjs/toolkit';
import AppSlice from './reducers/AppSlice';
import ControlPanelSlice from './reducers/ControlPanelSlice';
import DefectiveGoodsSlice from './reducers/DefectiveGoodsSlice';
import EmployeeSlice from './reducers/EmployeeSlice';
import EndingGoodsSlice from './reducers/EndingGoodsSlice';
import ModalSlice from './reducers/ModalSlice';
import MoveSlice from './reducers/MoveSlice';
import MoyskladSlice from './reducers/MoyskladSlice';
import OrderSlice from './reducers/OrderSlice';
import TaskSlice from './reducers/TaskSlice';
import UpdatePriceSlice from './reducers/UpdatePriceSlice';

const store = configureStore({
  reducer: {
    app: AppSlice,
    modal: ModalSlice,
    employee: EmployeeSlice,
    order: OrderSlice,
    controlPanel: ControlPanelSlice,
    moysklad: MoyskladSlice,
    move: MoveSlice,
    endingGoods: EndingGoodsSlice,
    updatePrice: UpdatePriceSlice,
    task: TaskSlice,
    defectiveGoods: DefectiveGoodsSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
