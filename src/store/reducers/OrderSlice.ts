import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialOrdersFilter } from 'constants/InitialStates/initialFilterState';
import {
  initialFoundOrders,
  initialOrder,
} from 'constants/InitialStates/initialOrderState';
import { IFinishedProduct } from 'models/IFinishedProduct';
import { IFoundOrders, IOrder, IOrdersFilter } from 'models/IOrder';
import { IShop } from 'models/IShop';
import { IStatus } from 'models/IStatus';
import { IUser } from 'models/IUser';

type OrderState = {
  order: IOrder;
  isMinimizedSidemenu: boolean;
  activeStatus: IStatus | null;
  beforeOrder: IOrder;
  finishedProductsForCreate: IFinishedProduct[];
  finishedProductsForUpdate: IFinishedProduct[];
  finishedProductsForDelete: number[];
  haveUnsavedData: boolean;
  forceUpdate: boolean;
  ordersFilter: IOrdersFilter;
  foundOrders: IFoundOrders;
  isLoading: boolean;
};

const initialState: OrderState = {
  order: initialOrder,
  isMinimizedSidemenu: true,
  activeStatus: { id: 0, name: '' },
  beforeOrder: initialOrder,
  finishedProductsForCreate: [],
  finishedProductsForUpdate: [],
  finishedProductsForDelete: [],
  haveUnsavedData: false,
  forceUpdate: false,
  ordersFilter: initialOrdersFilter,
  foundOrders: initialFoundOrders,
  isLoading: false,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setActiveStatus(state, action: PayloadAction<IStatus>) {
      state.activeStatus = action.payload;
    },
    setIsMinimizedSidemenu(state, action: PayloadAction<boolean>) {
      state.isMinimizedSidemenu = action.payload;
    },
    setBeforeOrder(state, action: PayloadAction<IOrder>) {
      state.beforeOrder = action.payload;
    },
    setOrder(state, action: PayloadAction<IOrder>) {
      state.order = action.payload;
    },
    setHaveUnsavedData(state, action: PayloadAction<boolean>) {
      state.haveUnsavedData = action.payload;
    },
    setOrderUser(state, action: PayloadAction<IUser | null>) {
      state.order.user = action.payload;
    },
    setPrepayment(state, action: PayloadAction<number>) {
      state.order.prepayment = action.payload;
    },
    setDeadline(state, action: PayloadAction<string>) {
      state.order.deadline = action.payload;
    },
    setComment(state, action: PayloadAction<string>) {
      state.order.comment = action.payload;
    },
    undoOrder(state) {
      state.order = state.beforeOrder;
      state.finishedProductsForCreate = [];
      state.finishedProductsForUpdate = [];
      state.finishedProductsForDelete = [];
    },
    deleteFinishedProduct(state, action: PayloadAction<number>) {
      const finishedProducts = state.order.finishedProducts.filter(
        (finishedProduct) => finishedProduct.id !== action.payload
      );
      state.order.finishedProducts = finishedProducts;
    },
    addFinishedProductsForDelete(state, action: PayloadAction<number>) {
      state.finishedProductsForDelete.push(action.payload);
    },
    clearOrder(state) {
      state.order = initialOrder;
      state.beforeOrder = initialOrder;
      state.finishedProductsForCreate = [];
      state.finishedProductsForUpdate = [];
      state.finishedProductsForDelete = [];
    },
    addFinishedProduct(state, action: PayloadAction<IFinishedProduct>) {
      state.order.finishedProducts.unshift(action.payload);
    },
    addFinishedProductsForCreate(
      state,
      action: PayloadAction<IFinishedProduct>
    ) {
      state.finishedProductsForCreate.push(action.payload);
    },
    updateFinishedProduct(state, action: PayloadAction<IFinishedProduct>) {
      const finishedProducts = state.order.finishedProducts.map(
        (finishedProduct) =>
          finishedProduct.id === action.payload.id
            ? action.payload
            : finishedProduct
      );
      state.order.finishedProducts = finishedProducts;
    },
    addFinishedProductsForUpdate(
      state,
      action: PayloadAction<IFinishedProduct>
    ) {
      state.finishedProductsForUpdate.push(action.payload);
    },
    saveOrder(state, action: PayloadAction<IOrder>) {
      state.beforeOrder = action.payload;
      state.finishedProductsForCreate = [];
      state.finishedProductsForUpdate = [];
      state.finishedProductsForDelete = [];
    },
    activeOrdersFilter(
      state,
      action: PayloadAction<{ shop: IShop; startDate: string; endDate: string }>
    ) {
      state.ordersFilter = {
        filter: {
          isActive: true,
          isPendingDeactivation: false,
        },
        ...action.payload,
      };
    },
    clearOrdersFilter(state) {
      state.ordersFilter = initialOrdersFilter;
      state.ordersFilter.filter.isPendingDeactivation = true;
    },
    deactiveOrdersFilter(state) {
      state.ordersFilter = initialOrdersFilter;
    },
    setForceUpdate(state, action: PayloadAction<boolean>) {
      state.forceUpdate = action.payload;
    },
    setFoundOrders(state, action: PayloadAction<IFoundOrders>) {
      state.foundOrders = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setActiveStatus,
  setIsMinimizedSidemenu,
  setBeforeOrder,
  setOrder,
  setHaveUnsavedData,
  setOrderUser,
  setPrepayment,
  setDeadline,
  setComment,
  undoOrder,
  deleteFinishedProduct,
  addFinishedProductsForDelete,
  clearOrder,
  addFinishedProduct,
  addFinishedProductsForCreate,
  updateFinishedProduct,
  addFinishedProductsForUpdate,
  saveOrder,
  activeOrdersFilter,
  clearOrdersFilter,
  deactiveOrdersFilter,
  setForceUpdate,
  setFoundOrders,
  setIsLoading,
} = orderSlice.actions;

export default orderSlice.reducer;
