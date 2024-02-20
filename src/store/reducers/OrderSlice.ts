import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SortingState } from '@tanstack/react-table';
import { INITIAL_ORDER, INITIAL_STATUS } from 'constants/initialStates';
import { IEditor } from 'models/IEditor';
import { IFilePathForUpload } from 'models/IFileForUpload';
import { IFavorite } from 'models/api/IFavorite';
import { IOrder } from 'models/api/IOrder';
import { IOrderFile } from 'models/api/IOrderFile';
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
  openedOrderStatus: IStatus | null;
  activeSidebarIndex: number;
  sidebarIsOpen: boolean;
  activeStatus: IStatus;
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
  orderEditors: IEditor[];
  favorites: IFavorite[];
  sortings: SortingState;
  orderFilePathsForUpload: IFilePathForUpload[];
  orderFilesForDelete: number[];
  lastActiveRowId: number;
};

const initialState: OrderState = {
  orders: [],
  statuses: [],
  openedOrderStatus: null,
  activeSidebarIndex: 0,
  sidebarIsOpen: true,
  activeStatus: INITIAL_STATUS,
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
  orderEditors: [],
  favorites: [],
  sortings: [{ id: 'status', desc: false }],
  orderFilePathsForUpload: [],
  orderFilesForDelete: [],
  lastActiveRowId: 0,
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
    setOpenedOrderStatus(state, action: PayloadAction<IStatus | null>) {
      state.openedOrderStatus = action.payload;
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
    clearOrder(state) {
      state.order = INITIAL_ORDER;
      state.beforeOrder = INITIAL_ORDER;
      state.orderProductsForCreate = [];
      state.orderProductsForUpdate = [];
      state.orderProductsForDelete = [];
      state.orderMembersForCreate = [];
      state.orderMembersForDelete = [];
      state.orderFilePathsForUpload = [];
      state.orderFilesForDelete = [];
      state.openedOrderStatus = null;
    },
    undoOrder(state) {
      state.order = state.beforeOrder;
      state.orderProductsForCreate = [];
      state.orderProductsForUpdate = [];
      state.orderProductsForDelete = [];
      state.orderMembersForCreate = [];
      state.orderMembersForDelete = [];
      state.orderFilePathsForUpload = [];
      state.orderFilesForDelete = [];
      state.haveUnsavedData = false;
    },
    saveOrder(state, action: PayloadAction<IOrder>) {
      state.beforeOrder = action.payload;
      state.orderProductsForCreate = [];
      state.orderProductsForUpdate = [];
      state.orderProductsForDelete = [];
      state.orderMembersForCreate = [];
      state.orderMembersForDelete = [];
      state.orderFilePathsForUpload = [];
      state.orderFilesForDelete = [];
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
    setOrderEditors(state, action: PayloadAction<IEditor[]>) {
      state.orderEditors = action.payload;
    },
    deleteOrderEditorByEmployeeId(state, action: PayloadAction<number>) {
      state.orderEditors = state.orderEditors.filter(
        (x) => x.employee.id !== action.payload
      );
    },
    setSortings(state, action: PayloadAction<SortingState>) {
      state.sortings = action.payload;
    },
    addOrderFiles(state, action: PayloadAction<IOrderFile[]>) {
      state.order.orderFiles?.push(...action.payload);
      state.order.orderFiles = state.order.orderFiles?.filter(
        (orderFile, index, self) =>
          self.findIndex((t) => {
            return (
              t.name === orderFile.name &&
              t.orderProductId === orderFile.orderProductId
            );
          }) === index
      );
    },
    deleteOrderFile(state, action: PayloadAction<number | string>) {
      state.order.orderFiles = state.order.orderFiles?.filter(
        (x) => x.id !== action.payload
      );
    },
    deleteOrderFilesByOrderProductId(
      state,
      action: PayloadAction<number | string>
    ) {
      state.order.orderFiles = state.order.orderFiles?.filter(
        (x) => x.orderProductId !== action.payload
      );
    },
    addOrderFilePathsForUpload(
      state,
      action: PayloadAction<IFilePathForUpload[]>
    ) {
      state.orderFilePathsForUpload.push(...action.payload);
      state.orderFilePathsForUpload = state.orderFilePathsForUpload.filter(
        (orderFile, index, self) =>
          self.findIndex((t) => {
            return (
              t.filePath === orderFile.filePath &&
              t.targetId === orderFile.targetId
            );
          }) === index
      );
    },
    deleteOrderFilePathForUpload(state, action: PayloadAction<string>) {
      state.orderFilePathsForUpload = state.orderFilePathsForUpload.filter(
        (x) => x.id !== action.payload
      );
    },
    deleteOrderFilePathForUploadByOrderProductId(
      state,
      action: PayloadAction<string | number>
    ) {
      state.orderFilePathsForUpload = state.orderFilePathsForUpload.filter(
        (x) => x.targetId != action.payload
      );
    },
    addOrderFilesForDelete(state, action: PayloadAction<number[]>) {
      state.orderFilesForDelete.push(...action.payload);
    },
    setLastActiveRowId(state, action: PayloadAction<number>) {
      state.lastActiveRowId = action.payload;
    },
    clearState() {
      return initialState;
    },
  },
});

export const orderActions = orderSlice.actions;
export default orderSlice.reducer;
