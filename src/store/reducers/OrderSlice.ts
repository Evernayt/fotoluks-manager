import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SortingState } from '@tanstack/react-table';
import { INITIAL_ORDER } from 'constants/initialStates';
import { IWatcher } from 'models/IWatcher';
import { IFavorite } from 'models/api/IFavorite';
import { IOrder } from 'models/api/IOrder';
import { IOrderMember } from 'models/api/IOrderMember';
import { IOrderProduct } from 'models/api/IOrderProduct';
import { IStatus } from 'models/api/IStatus';
import { IUser } from 'models/api/IUser';
import {
  INITIAL_ORDERS_FILTER_STATE,
  IOrdersFilterState,
} from 'pages/orders-page/modals/filter-modal/OrdersFilterModal';

type OrderState = {
  orders: IOrder[];
  statuses: IStatus[];
  activeSidebarIndex: number;
  sidebarIsOpen: boolean;
  activeStatus: IStatus | null;
  search: string;
  isLoading: boolean;
  forceUpdate: boolean;
  filterState: IOrdersFilterState;
  order: IOrder;
  beforeOrder: IOrder;
  haveUnsavedData: boolean;
  orderProductsForCreate: IOrderProduct[];
  orderProductsForUpdate: IOrderProduct[];
  orderProductsForDelete: number[];
  orderMembersForCreate: IOrderMember[];
  orderMembersForDelete: number[];
  watchers: IWatcher[];
  favorites: IFavorite[];
  sortings: SortingState;
};

const initialState: OrderState = {
  orders: [],
  statuses: [],
  activeSidebarIndex: 0,
  sidebarIsOpen: true,
  activeStatus: null,
  search: '',
  isLoading: false,
  forceUpdate: false,
  filterState: INITIAL_ORDERS_FILTER_STATE,
  order: INITIAL_ORDER,
  beforeOrder: INITIAL_ORDER,
  haveUnsavedData: false,
  orderProductsForCreate: [],
  orderProductsForUpdate: [],
  orderProductsForDelete: [],
  orderMembersForCreate: [],
  orderMembersForDelete: [],
  watchers: [],
  favorites: [],
  sortings: [{ id: 'status', desc: false }],
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<IOrder[]>) {
      state.orders = action.payload;
    },
    setStatuses(state, action: PayloadAction<IStatus[]>) {
      state.statuses = action.payload;
    },
    setActiveSidebarIndex(state, action: PayloadAction<number>) {
      state.activeSidebarIndex = action.payload;
    },
    setSidebarIsOpen(state, action: PayloadAction<boolean>) {
      state.sidebarIsOpen = action.payload;
    },
    setActiveStatus(state, action: PayloadAction<IStatus>) {
      state.activeStatus = action.payload;
    },
    updateOrder(state, action: PayloadAction<IOrder>) {
      const orders = state.orders.map((order) =>
        order.id === action.payload.id ? action.payload : order
      );
      state.orders = orders;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setForceUpdate(state, action: PayloadAction<boolean>) {
      state.forceUpdate = action.payload;
    },
    setFilterState(state, action: PayloadAction<IOrdersFilterState>) {
      state.filterState = action.payload;
    },
    setOrder(state, action: PayloadAction<IOrder>) {
      state.order = action.payload;
    },
    setBeforeOrder(state, action: PayloadAction<IOrder>) {
      state.beforeOrder = action.payload;
    },
    clearOrder(state) {
      state.order = INITIAL_ORDER;
      state.beforeOrder = INITIAL_ORDER;
      state.orderProductsForCreate = [];
      state.orderProductsForUpdate = [];
      state.orderProductsForDelete = [];
      state.orderMembersForCreate = [];
      state.orderMembersForDelete = [];
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
    setDiscount(state, action: PayloadAction<number>) {
      state.order.discount = action.payload;
    },
    setDeadline(state, action: PayloadAction<string>) {
      state.order.deadline = action.payload;
    },
    setComment(state, action: PayloadAction<string>) {
      state.order.comment = action.payload;
    },
    undoOrder(state) {
      state.order = state.beforeOrder;
      state.orderProductsForCreate = [];
      state.orderProductsForUpdate = [];
      state.orderProductsForDelete = [];
      state.orderMembersForCreate = [];
      state.orderMembersForDelete = [];
    },
    saveOrder(state, action: PayloadAction<IOrder>) {
      state.beforeOrder = action.payload;
      state.orderProductsForCreate = [];
      state.orderProductsForUpdate = [];
      state.orderProductsForDelete = [];
      state.orderMembersForCreate = [];
      state.orderMembersForDelete = [];
    },
    addOrderProduct(state, action: PayloadAction<IOrderProduct>) {
      state.order.orderProducts?.unshift(action.payload);
    },
    updateOrderProduct(state, action: PayloadAction<IOrderProduct>) {
      const orderProducts = state.order.orderProducts?.map((orderProduct) =>
        orderProduct.id === action.payload.id ? action.payload : orderProduct
      );
      state.order.orderProducts = orderProducts;
    },
    deleteOrderProduct(state, action: PayloadAction<number | string>) {
      const orderProducts = state.order.orderProducts?.filter(
        (orderProduct) => orderProduct.id !== action.payload
      );
      state.order.orderProducts = orderProducts;

      const orderProductsForCreate = state.orderProductsForCreate.filter(
        (orderProduct) => orderProduct.id !== action.payload
      );
      state.orderProductsForCreate = orderProductsForCreate;
    },
    addOrderProductsForCreate(state, action: PayloadAction<IOrderProduct>) {
      const orderProductForCreate = state.orderProductsForCreate.find(
        (orderProduct) => orderProduct.id === action.payload.id
      );

      if (orderProductForCreate) {
        const orderProductsForCreate = state.orderProductsForCreate.map(
          (orderProduct) =>
            orderProduct.id === action.payload.id
              ? action.payload
              : orderProduct
        );

        state.orderProductsForCreate = orderProductsForCreate;
      } else {
        state.orderProductsForCreate.push(action.payload);
      }
    },
    addOrderProductsForUpdate(state, action: PayloadAction<IOrderProduct>) {
      const orderProductForUpdate = state.orderProductsForUpdate.find(
        (orderProduct) => orderProduct.id === action.payload.id
      );
      if (orderProductForUpdate) {
        const orderProductsForUpdate = state.orderProductsForUpdate.map(
          (orderProduct) =>
            orderProduct.id === action.payload.id
              ? action.payload
              : orderProduct
        );
        state.orderProductsForUpdate = orderProductsForUpdate;
      } else {
        state.orderProductsForUpdate.push(action.payload);
      }
    },
    addOrderProductsForDelete(state, action: PayloadAction<number>) {
      state.orderProductsForDelete.push(action.payload);
    },
    setFavorites(state, action: PayloadAction<IFavorite[]>) {
      state.favorites = action.payload;
    },
    addFavorite(state, action: PayloadAction<IFavorite>) {
      state.favorites.push(action.payload);
    },
    deleteFavoriteByProductId(state, action: PayloadAction<number>) {
      const favorites = state.favorites.filter(
        (favorite) => favorite.productId !== action.payload
      );
      state.favorites = favorites;
    },
    addOrderMember(state, action: PayloadAction<IOrderMember>) {
      state.order.orderMembers?.push(action.payload);

      const orderMembersForDelete = state.orderMembersForDelete.filter(
        (employeeId) => employeeId !== action.payload.employee.id
      );
      state.orderMembersForDelete = orderMembersForDelete;
    },
    addOrderMembers(state, action: PayloadAction<IOrderMember[]>) {
      state.order.orderMembers?.push(...action.payload);
      state.orderMembersForDelete = [];
    },
    addOrderMemberForCreate(state, action: PayloadAction<IOrderMember>) {
      state.orderMembersForCreate.push(action.payload);
    },
    addOrderMembersForCreate(state, action: PayloadAction<IOrderMember[]>) {
      state.orderMembersForCreate.push(...action.payload);
    },
    deleteOrderMemberByEmployeeId(state, action: PayloadAction<number>) {
      const orderMembers = state.order.orderMembers?.filter(
        (orderMember) => orderMember.employee.id !== action.payload
      );
      state.order.orderMembers = orderMembers;

      const orderMembersForCreate = state.orderMembersForCreate.filter(
        (orderMember) => orderMember.employee.id !== action.payload
      );
      state.orderMembersForCreate = orderMembersForCreate;
    },
    deleteOrderMembers(state) {
      state.order.orderMembers = [];
      state.orderMembersForCreate = [];
    },
    addOrderMemberForDeleteByEmployeeId(state, action: PayloadAction<number>) {
      state.orderMembersForDelete.push(action.payload);
    },
    addOrderMembersForDeleteByEmployeeIds(
      state,
      action: PayloadAction<number[]>
    ) {
      state.orderMembersForDelete.push(...action.payload);
    },
    setWatchers(state, action: PayloadAction<IWatcher[]>) {
      state.watchers = action.payload;
    },
    setSortings(state, action: PayloadAction<SortingState>) {
      state.sortings = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const orderActions = orderSlice.actions;
export default orderSlice.reducer;
