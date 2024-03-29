import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_MODAL } from 'constants/initialStates';
import {
  IProductsEditModal,
  ILoginModal,
  IModal,
  IEmployeesEditModal,
  IUsersEditModal,
  IShopsEditModal,
  IOrderClientEditModal,
  IOrderProductEditModal,
  IOrdersInfoModal,
  IOrdersShopModal,
  IEndingGoodsProductModal,
  IUpdatePricesModal,
  ITaskEditMessageModal,
  IOrdersReasonModal,
  IChangelogsEditModal,
  IOrderFilesModal,
  IChatEditModal,
  IChatDeleteModal,
  IChatLeaveModal,
  IMessengerEditMessageModal,
} from 'models/IModal';

type ModalState = {
  /* login-page */
  loginModal: ILoginModal;
  /* orders-page */
  ordersExportModal: IModal;
  ordersFilterModal: IModal;
  ordersInfoModal: IOrdersInfoModal;
  ordersShopModal: IOrdersShopModal;
  ordersReasonModal: IOrdersReasonModal;
  /* order-detail-page */
  orderMembersModal: IModal;
  orderClientEditModal: IOrderClientEditModal;
  orderCancelModal: IModal;
  orderUnsavedDataModal: IModal;
  orderProductEditModal: IOrderProductEditModal;
  orderFilesModal: IOrderFilesModal;
  /* control-page */
  productsEditModal: IProductsEditModal;
  productsFilterModal: IModal;
  usersEditModal: IUsersEditModal;
  usersFilterModal: IModal;
  employeesEditModal: IEmployeesEditModal;
  employeesFilterModal: IModal;
  shopsEditModal: IShopsEditModal;
  shopsFilterModal: IModal;
  changelogsEditModal: IChangelogsEditModal;
  /* moysklad-page */
  endingGoodsProductModal: IEndingGoodsProductModal;
  updatePricesModal: IUpdatePricesModal;
  defectiveGoodsModal: IModal;
  /* tasks-page */
  tasksFilterModal: IModal;
  taskCancelModal: IModal;
  taskUnsavedDataModal: IModal;
  taskMembersModal: IModal;
  taskSubtasksModal: IModal;
  taskEditMessageModal: ITaskEditMessageModal;
  /* messenger-page */
  messengerChatEditModal: IChatEditModal;
  messengerChatDeleteModal: IChatDeleteModal;
  messengerChatLeaveModal: IChatLeaveModal;
  messengerEditMessageModal: IMessengerEditMessageModal;
  /* global */
  appCloseModal: IModal;
  reportModal: IModal;
};

const initialState: ModalState = {
  /* login-page */
  loginModal: INITIAL_MODAL,
  /* orders-page */
  ordersExportModal: INITIAL_MODAL,
  ordersFilterModal: INITIAL_MODAL,
  ordersInfoModal: INITIAL_MODAL,
  ordersShopModal: INITIAL_MODAL,
  ordersReasonModal: INITIAL_MODAL,
  /* order-detail-page */
  orderMembersModal: INITIAL_MODAL,
  orderClientEditModal: INITIAL_MODAL,
  orderCancelModal: INITIAL_MODAL,
  orderUnsavedDataModal: INITIAL_MODAL,
  orderProductEditModal: INITIAL_MODAL,
  orderFilesModal: INITIAL_MODAL,
  /* control-page */
  productsEditModal: INITIAL_MODAL,
  productsFilterModal: INITIAL_MODAL,
  usersEditModal: INITIAL_MODAL,
  usersFilterModal: INITIAL_MODAL,
  employeesEditModal: INITIAL_MODAL,
  employeesFilterModal: INITIAL_MODAL,
  shopsEditModal: INITIAL_MODAL,
  shopsFilterModal: INITIAL_MODAL,
  changelogsEditModal: INITIAL_MODAL,
  /* moysklad-page */
  endingGoodsProductModal: INITIAL_MODAL,
  updatePricesModal: INITIAL_MODAL,
  defectiveGoodsModal: INITIAL_MODAL,
  /* tasks-page */
  tasksFilterModal: INITIAL_MODAL,
  taskCancelModal: INITIAL_MODAL,
  taskUnsavedDataModal: INITIAL_MODAL,
  taskMembersModal: INITIAL_MODAL,
  taskSubtasksModal: INITIAL_MODAL,
  taskEditMessageModal: INITIAL_MODAL,
  /* messenger-page */
  messengerChatEditModal: INITIAL_MODAL,
  messengerChatDeleteModal: INITIAL_MODAL,
  messengerChatLeaveModal: INITIAL_MODAL,
  messengerEditMessageModal: INITIAL_MODAL,
  /* global */
  appCloseModal: INITIAL_MODAL,
  reportModal: INITIAL_MODAL,
};

interface OpenModalProps {
  modal: keyof ModalState;
  props?: Partial<ModalState[keyof ModalState]>;
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state: ModalState, action: PayloadAction<OpenModalProps>) {
      state[action.payload.modal] = {
        ...action.payload.props,
        isOpen: true,
      };
    },
    closeModal(state, action: PayloadAction<keyof ModalState>) {
      state[action.payload] = initialState[action.payload];
    },
  },
});

export const modalActions = modalSlice.actions;
export default modalSlice.reducer;
