import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Modes } from 'constants/app';
import {
  initialEditCategoryModal,
  initialEditParamsModal,
  initialEditProductModal,
  initialEditTypeModal,
  initialLoginModal,
  initialModal,
  initialOrderModal,
  initialUserModal,
  initialUserRegistrationModal,
} from 'constants/InitialStates/initialModalState';
import { IFeature } from 'models/IFeature';
import {
  IEditCategoryModal,
  IEditParamsModal,
  IEditProductModal,
  IEditTypeModal,
  ILoginModal,
  IModal,
  IOrderModal,
  IUserModal,
  IUserRegistrationModal,
} from 'models/IModal';
import { IOrder } from 'models/IOrder';
import { IUser } from 'models/IUser';

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
  controlPanelTypesFilterModal: IModal;
  controlPanelEditTypeModal: IEditTypeModal;
  controlPanelEditProductModal: IEditProductModal;
  controlPanelEditCategoryModal: IEditCategoryModal;
  controlPanelEditParamsModal: IEditParamsModal;
  loginModal: ILoginModal;
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
  orderMembersModal: initialModal,
  controlPanelTypesFilterModal: initialModal,
  controlPanelEditTypeModal: initialEditTypeModal,
  controlPanelEditProductModal: initialEditProductModal,
  controlPanelEditCategoryModal: initialEditCategoryModal,
  controlPanelEditParamsModal: initialEditParamsModal,
  loginModal: initialLoginModal,
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
    openOrderInfoModal(state, action: PayloadAction<IOrder>) {
      state.orderInfoModal.isShowing = true;
      state.orderInfoModal.order = action.payload;
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
    openOrderShopModal(state, action: PayloadAction<IOrder>) {
      state.orderShopModal.isShowing = true;
      state.orderShopModal.order = action.payload;
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
    openControlPanelTypesFilterModal(state) {
      state.controlPanelTypesFilterModal.isShowing = true;
    },
    closeControlPanelTypesFilterModal(state) {
      state.controlPanelTypesFilterModal.isShowing = false;
    },
    openControlPanelEditTypeModal(
      state,
      action: PayloadAction<{ typeId: number; mode: Modes }>
    ) {
      state.controlPanelEditTypeModal.isShowing = true;
      state.controlPanelEditTypeModal.typeId = action.payload.typeId;
      state.controlPanelEditTypeModal.mode = action.payload.mode;
    },
    closeControlPanelEditTypeModal(state) {
      state.controlPanelEditTypeModal.isShowing = false;
    },
    openControlPanelEditProductModal(
      state,
      action: PayloadAction<{ productId: number; mode: Modes }>
    ) {
      state.controlPanelEditProductModal.isShowing = true;
      state.controlPanelEditProductModal.productId = action.payload.productId;
      state.controlPanelEditProductModal.mode = action.payload.mode;
    },
    closeControlPanelEditProductModal(state) {
      state.controlPanelEditProductModal.isShowing = false;
    },
    openControlPanelEditCategoryModal(
      state,
      action: PayloadAction<{ categoryId: number; mode: Modes }>
    ) {
      state.controlPanelEditCategoryModal.isShowing = true;
      state.controlPanelEditCategoryModal.categoryId =
        action.payload.categoryId;
      state.controlPanelEditCategoryModal.mode = action.payload.mode;
    },
    closeControlPanelEditCategoryModal(state) {
      state.controlPanelEditCategoryModal.isShowing = false;
    },
    openControlPanelEditParamsModal(
      state,
      action: PayloadAction<{
        typeId: number;
        feature: IFeature;
      }>
    ) {
      state.controlPanelEditParamsModal.isShowing = true;
      state.controlPanelEditParamsModal.typeId = action.payload.typeId;
      state.controlPanelEditParamsModal.feature = action.payload.feature;
    },
    closeControlPanelEditParamsModal(state) {
      state.controlPanelEditParamsModal.isShowing = false;
    },
    openLoginModal(state, action: PayloadAction<IUser>) {
      state.loginModal.isShowing = true;
      state.loginModal.user = action.payload;
    },
    closeLoginModal(state) {
      state.loginModal.isShowing = false;
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
  closeOrderMembersModal,
  openControlPanelTypesFilterModal,
  closeControlPanelTypesFilterModal,
  openControlPanelEditTypeModal,
  closeControlPanelEditTypeModal,
  openControlPanelEditProductModal,
  closeControlPanelEditProductModal,
  openControlPanelEditCategoryModal,
  closeControlPanelEditCategoryModal,
  openControlPanelEditParamsModal,
  closeControlPanelEditParamsModal,
  openLoginModal,
  closeLoginModal,
} = modalSlice.actions;

export default modalSlice.reducer;
