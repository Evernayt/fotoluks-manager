import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Modes } from 'constants/app';
import {
  initialEditCategoryModal,
  initialEditFeatureModal,
  initialEditTypeParamsModal,
  initialEditProductModal,
  initialEditTypeModal,
  initialLoginModal,
  initialModal,
  initialOrderModal,
  initialUserModal,
  initialUserRegistrationModal,
  initialEditParamModal,
} from 'constants/InitialStates/initialModalState';
import { IFeature } from 'models/IFeature';
import {
  IEditCategoryModal,
  IEditFeatureModal,
  IEditTypeParamsModal,
  IEditProductModal,
  IEditTypeModal,
  ILoginModal,
  IModal,
  IOrderModal,
  IUserModal,
  IUserRegistrationModal,
  IEditParamModal,
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
  controlPanelEditTypeParamsModal: IEditTypeParamsModal;
  loginModal: ILoginModal;
  orderDetailAddFavoriteModal: IModal;
  controlPanelCategoriesFilterModal: IModal;
  controlPanelProductsFilterModal: IModal;
  controlPanelFeaturesFilterModal: IModal;
  controlPanelEditFeatureModal: IEditFeatureModal;
  controlPanelParamsFilterModal: IModal;
  controlPanelEditParamModal: IEditParamModal;
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
  controlPanelEditTypeParamsModal: initialEditTypeParamsModal,
  loginModal: initialLoginModal,
  orderDetailAddFavoriteModal: initialModal,
  controlPanelCategoriesFilterModal: initialModal,
  controlPanelProductsFilterModal: initialModal,
  controlPanelFeaturesFilterModal: initialModal,
  controlPanelEditFeatureModal: initialEditFeatureModal,
  controlPanelParamsFilterModal: initialModal,
  controlPanelEditParamModal: initialEditParamModal,
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
    openControlPanelEditTypeParamsModal(
      state,
      action: PayloadAction<{
        typeId: number;
        feature: IFeature;
      }>
    ) {
      state.controlPanelEditTypeParamsModal.isShowing = true;
      state.controlPanelEditTypeParamsModal.typeId = action.payload.typeId;
      state.controlPanelEditTypeParamsModal.feature = action.payload.feature;
    },
    closeControlPanelEditTypeParamsModal(state) {
      state.controlPanelEditTypeParamsModal.isShowing = false;
    },
    openLoginModal(state, action: PayloadAction<IUser>) {
      state.loginModal.isShowing = true;
      state.loginModal.user = action.payload;
    },
    closeLoginModal(state) {
      state.loginModal.isShowing = false;
    },
    openOrderDetailAddFavoriteModal(state) {
      state.orderDetailAddFavoriteModal.isShowing = true;
    },
    closeOrderDetailAddFavoriteModal(state) {
      state.orderDetailAddFavoriteModal.isShowing = false;
    },
    openControlPanelCategoriesFilterModal(state) {
      state.controlPanelCategoriesFilterModal.isShowing = true;
    },
    closeControlPanelCategoriesFilterModal(state) {
      state.controlPanelCategoriesFilterModal.isShowing = false;
    },
    openControlPanelProductsFilterModal(state) {
      state.controlPanelProductsFilterModal.isShowing = true;
    },
    closeControlPanelProductsFilterModal(state) {
      state.controlPanelProductsFilterModal.isShowing = false;
    },
    openControlPanelFeaturesFilterModal(state) {
      state.controlPanelFeaturesFilterModal.isShowing = true;
    },
    closeControlPanelFeaturesFilterModal(state) {
      state.controlPanelFeaturesFilterModal.isShowing = false;
    },
    openControlPanelEditFeatureModal(
      state,
      action: PayloadAction<IEditFeatureModal>
    ) {
      state.controlPanelEditFeatureModal.isShowing = true;
      state.controlPanelEditFeatureModal.featureId = action.payload.featureId;
      state.controlPanelEditFeatureModal.mode = action.payload.mode;
    },
    closeControlPanelEditFeatureModal(state) {
      state.controlPanelEditFeatureModal = initialEditFeatureModal;
    },
    openControlPanelParamsFilterModal(state) {
      state.controlPanelParamsFilterModal.isShowing = true;
    },
    closeControlPanelParamsFilterModal(state) {
      state.controlPanelParamsFilterModal.isShowing = false;
    },
    openControlPanelEditParamModal(
      state,
      action: PayloadAction<IEditParamModal>
    ) {
      state.controlPanelEditParamModal.isShowing = true;
      state.controlPanelEditParamModal.paramId = action.payload.paramId;
      state.controlPanelEditParamModal.mode = action.payload.mode;
    },
    closeControlPanelEditParamModal(state) {
      state.controlPanelEditParamModal = initialEditParamModal;
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
  openControlPanelEditTypeParamsModal,
  closeControlPanelEditTypeParamsModal,
  openLoginModal,
  closeLoginModal,
  openOrderDetailAddFavoriteModal,
  closeOrderDetailAddFavoriteModal,
  openControlPanelCategoriesFilterModal,
  closeControlPanelCategoriesFilterModal,
  openControlPanelProductsFilterModal,
  closeControlPanelProductsFilterModal,
  openControlPanelFeaturesFilterModal,
  closeControlPanelFeaturesFilterModal,
  openControlPanelEditFeatureModal,
  closeControlPanelEditFeatureModal,
  openControlPanelParamsFilterModal,
  closeControlPanelParamsFilterModal,
  openControlPanelEditParamModal,
  closeControlPanelEditParamModal,
} = modalSlice.actions;

export default modalSlice.reducer;
