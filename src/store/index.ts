import { configureStore } from '@reduxjs/toolkit';
import AppSlice from './reducers/AppSlice';
import DefectiveGoodsSlice from './reducers/DefectiveGoodsSlice';
import EmployeeSlice from './reducers/EmployeeSlice';
import EndingGoodsSlice from './reducers/EndingGoodsSlice';
import ModalSlice from './reducers/ModalSlice';
import MoveSlice from './reducers/MoveSlice';
import MoyskladSlice from './reducers/MoyskladSlice';
import OrderSlice from './reducers/OrderSlice';
import TaskSlice from './reducers/TaskSlice';
import FilterSlice from './reducers/FilterSlice';
import ControlSlice from './reducers/ControlSlice';

const store = configureStore({
  reducer: {
    app: AppSlice,
    modal: ModalSlice,
    filter: FilterSlice,
    employee: EmployeeSlice,
    order: OrderSlice,
    control: ControlSlice,
    moysklad: MoyskladSlice,
    endingGoods: EndingGoodsSlice,
    task: TaskSlice,
    move: MoveSlice,
    defectiveGoods: DefectiveGoodsSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
