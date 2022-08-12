import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  initialModal,
  initialOrderModal,
  initialUserModal,
  initialUserRegistrationModal,
} from 'constants/InitialStates/initialModalState';
import {
  IModal,
  IOrderModal,
  IUserModal,
  IUserRegistrationModal,
} from 'models/IModal';

type ModalState = {
  controlPanelUsersFilterModal: IModal;
  orderInfoModal: IOrderModal;
  ordersExportModal: IModal;
  ordersFilterModal: IModal;
  orderShopModal: IOrderModal;
  userRegistrationModal: IUserRegistrationModal;
  editUserModal: IUserModal;
  controlPanelEditUserModal: IUserModal;
  orderMembersModal: IModal;
};

const initialState: ModalState = {
  controlPanelUsersFilterModal: initialModal,
  orderInfoModal: initialOrderModal,
  ordersExportModal: initialModal,
  ordersFilterModal: initialModal,
  orderShopModal: initialOrderModal,
  userRegistrationModal: initialUserRegistrationModal,
  editUserModal: initialUserModal,
  controlPanelEditUserModal: initialUserModal,
  orderMembersModal: initialModal
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openControlPanelUsersFilterModal(state) {
      state.controlPanelUsersFilterModal.isShowing = true;
    },
    closeControlPanelUsersFilterModal(state) {
      state.controlPanelUsersFilterModal.isShowing = false;
    },
    openOrderInfoModal(state, action: PayloadAction<number>) {
      state.orderInfoModal.isShowing = true;
      state.orderInfoModal.orderId = action.payload;
    },
    closeOrderInfoModal(state) {
      state.orderInfoModal = initialOrderModal;
    },
    openOrdersExportModal(state) {
      state.ordersExportModal.isShowing = true;
    },
    closeOrdersExportModal(state) {
      state.ordersExportModal = initialModal;
    },
    openOrdersFilterModal(state) {
      state.ordersFilterModal.isShowing = true;
    },
    closeOrdersFilterModal(state) {
      state.ordersFilterModal = initialModal;
    },
    openOrderShopModal(state, action: PayloadAction<number>) {
      state.orderShopModal.isShowing = true;
      state.orderShopModal.orderId = action.payload;
    },
    closeOrderShopModal(state) {
      state.orderShopModal = initialOrderModal;
    },
    openUserRegistrationModal(state, action: PayloadAction<string>) {
      state.userRegistrationModal.isShowing = true;
      state.userRegistrationModal.text = action.payload;
    },
    closeUserRegistrationModal(state) {
      state.userRegistrationModal = initialUserRegistrationModal;
    },
    openEditUserModal(state, action: PayloadAction<string>) {
      state.editUserModal.isShowing = true;
      state.editUserModal.phone = action.payload;
    },
    closeEditUserModal(state) {
      state.editUserModal = initialUserModal;
    },
    openControlPanelEditUserModal(state, action: PayloadAction<string>) {
      state.controlPanelEditUserModal.isShowing = true;
      state.controlPanelEditUserModal.phone = action.payload;
    },
    closeControlPanelEditUserModal(state) {
      state.controlPanelEditUserModal = initialUserModal;
    },
    openOrderMembersModal(state) {
      state.orderMembersModal.isShowing = true;
    },
    closeOrderMembersModal(state) {
      state.orderMembersModal.isShowing = false;
    },
  },
});

export const {
  openControlPanelUsersFilterModal,
  closeControlPanelUsersFilterModal,
  openOrderInfoModal,
  closeOrderInfoModal,
  openOrdersExportModal,
  closeOrdersExportModal,
  openOrdersFilterModal,
  closeOrdersFilterModal,
  openOrderShopModal,
  closeOrderShopModal,
  openUserRegistrationModal,
  closeUserRegistrationModal,
  openEditUserModal,
  closeEditUserModal,
  openControlPanelEditUserModal,
  closeControlPanelEditUserModal,
  openOrderMembersModal,
  closeOrderMembersModal
} = modalSlice.actions;

export default modalSlice.reducer;
