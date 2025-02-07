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
import MessengerSlice from './reducers/MessengerSlice';
import SupplySlice from './reducers/SupplySlice';
import SubtractFromSupplySlice from './reducers/SubtractFromSupplySlice';

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
    messenger: MessengerSlice,
    supply: SupplySlice,
    subtractFromSupply: SubtractFromSupplySlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
