import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialOrdersFilter } from 'constants/InitialStates/initialFilterState';
import {
  initialFoundOrders,
  initialOrder,
} from 'constants/InitialStates/initialOrderState';
import { IFavorite } from 'models/IFavorite';
import { IFinishedProduct } from 'models/IFinishedProduct';
import { IFoundOrders, IOrder, IOrdersFilter } from 'models/IOrder';
import { IOrderMember } from 'models/IOrderMember';
import { IShop } from 'models/IShop';
import { IStatus } from 'models/IStatus';
import { IUser } from 'models/IUser';

type OrderState = {
  orders: IOrder[];
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
  orderMembersForCreate: IOrderMember[];
  orderMembersForDelete: number[];
  favorites: IFavorite[];
};

const initialState: OrderState = {
  orders: [],
  order: initialOrder,
  isMinimizedSidemenu: true,
  activeStatus: { id: 0, name: '', color: '#fff' },
  beforeOrder: initialOrder,
  finishedProductsForCreate: [],
  finishedProductsForUpdate: [],
  finishedProductsForDelete: [],
  haveUnsavedData: false,
  forceUpdate: false,
  ordersFilter: initialOrdersFilter,
  foundOrders: initialFoundOrders,
  isLoading: false,
  orderMembersForCreate: [],
  orderMembersForDelete: [],
  favorites: [],
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<IOrder[]>) {
      state.orders = action.payload;
    },
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
      state.orderMembersForCreate = [];
      state.orderMembersForDelete = [];
    },
    deleteFinishedProduct(state, action: PayloadAction<number | string>) {
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
      state.orderMembersForCreate = [];
      state.orderMembersForDelete = [];
    },
    addFinishedProduct(state, action: PayloadAction<IFinishedProduct>) {
      state.order.finishedProducts.unshift(action.payload);
    },
    addFinishedProductsForCreate(
      state,
      action: PayloadAction<IFinishedProduct>
    ) {
      const finishedProductForCreate = state.finishedProductsForCreate.find(
        (x) => x.id === action.payload.id
      );

      if (finishedProductForCreate === undefined) {
        state.finishedProductsForCreate.push(action.payload);
      } else {
        const finishedProductsForCreate = state.finishedProductsForCreate.map(
          (x) => (x.id === action.payload.id ? action.payload : x)
        );

        state.finishedProductsForCreate = finishedProductsForCreate;
      }
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
      const finishedProductForUpdate = state.finishedProductsForUpdate.find(
        (x) => x.id === action.payload.id
      );

      if (finishedProductForUpdate === undefined) {
        state.finishedProductsForUpdate.push(action.payload);
      } else {
        const finishedProductsForUpdate = state.finishedProductsForUpdate.map(
          (x) => (x.id === action.payload.id ? action.payload : x)
        );

        state.finishedProductsForUpdate = finishedProductsForUpdate;
      }
    },
    saveOrder(state, action: PayloadAction<IOrder>) {
      state.beforeOrder = action.payload;
      state.finishedProductsForCreate = [];
      state.finishedProductsForUpdate = [];
      state.finishedProductsForDelete = [];
      state.orderMembersForCreate = [];
      state.orderMembersForDelete = [];
    },
    activeOrdersFilter(
      state,
      action: PayloadAction<{
        shop: IShop;
        startDate: string;
        endDate: string;
        userId: number;
      }>
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
    addOrderMember(state, action: PayloadAction<IOrderMember>) {
      state.order.orderMembers.push(action.payload);
    },
    addOrderMembers(state, action: PayloadAction<IOrderMember[]>) {
      state.order.orderMembers.push(...action.payload);
    },
    addOrderMemberForCreate(state, action: PayloadAction<IOrderMember>) {
      state.orderMembersForCreate.push(action.payload);
    },
    addOrderMembersForCreate(state, action: PayloadAction<IOrderMember[]>) {
      state.orderMembersForCreate.push(...action.payload);
    },
    deleteOrderMemberByUserId(state, action: PayloadAction<number>) {
      const orderMembers = state.order.orderMembers.filter(
        (orderMember) => orderMember.user.id !== action.payload
      );
      state.order.orderMembers = orderMembers;
    },
    deleteOrderMembersByShopId(state, action: PayloadAction<number>) {
      const orderMembers = state.order.orderMembers.filter(
        (orderMember) => orderMember.user.shopId !== action.payload
      );
      state.order.orderMembers = orderMembers;
    },
    addOrderMemberForDeleteByUserId(state, action: PayloadAction<number>) {
      state.orderMembersForDelete.push(action.payload);
    },
    addOrderMembersForDeleteByUserId(state, action: PayloadAction<number[]>) {
      state.orderMembersForDelete.push(...action.payload);
    },
    updateOrder(state, action: PayloadAction<IOrder>) {
      const orders = state.orders.map((order) =>
        order.id === action.payload.id ? action.payload : order
      );
      state.orders = orders;
    },
    setFavorites(state, action: PayloadAction<IFavorite[]>) {
      state.favorites = action.payload;
    },
    addFavorite(state, action: PayloadAction<IFavorite>) {
      state.favorites.push(action.payload);
    },
    deleteFavoriteById(state, action: PayloadAction<number>) {
      const favorites = state.favorites.filter(
        (favorite) => favorite.id !== action.payload
      );
      state.favorites = favorites;
    },
  },
});

export const {
  setOrders,
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
  addOrderMember,
  addOrderMembers,
  addOrderMemberForCreate,
  addOrderMembersForCreate,
  deleteOrderMemberByUserId,
  deleteOrderMembersByShopId,
  addOrderMemberForDeleteByUserId,
  addOrderMembersForDeleteByUserId,
  updateOrder,
  setFavorites,
  addFavorite,
  deleteFavoriteById,
} = orderSlice.actions;

export default orderSlice.reducer;
