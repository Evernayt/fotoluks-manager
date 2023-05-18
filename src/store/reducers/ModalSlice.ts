import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  INITIAL_EDIT_CATEGORY_MODAL,
  INITIAL_EDIT_EMPLOYEE_MODAL,
  INITIAL_EDIT_FEATURE_MODAL,
  INITIAL_EDIT_PARAM_MODAL,
  INITIAL_EDIT_PRODUCT_MODAL,
  INITIAL_EDIT_SHOP_MODAL,
  INITIAL_EDIT_TYPE_MODAL,
  INITIAL_EDIT_TYPE_PARAMS_MODAL,
  INITIAL_EDIT_USER_MODAL,
  INITIAL_ENDING_GOODS_EDIT_PRODUCT_MODAL,
  INITIAL_ENDING_GOODS_PRODUCT_MODAL,
  INITIAL_LOGIN_MODAL,
  INITIAL_MODAL,
  INITIAL_ORDER_MODAL,
  INITIAL_UPDATE_PRICE_MODAL,
  INITIAL_USER_MODAL,
  INITIAL_USER_REGISTRATION_MODAL,
} from 'constants/states/modal-states';
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
  IEditShopModal,
  IEditUserModal,
  IEditEmployeeModal,
  IEndingGoodsProductModal,
  IEndingGoodsEditProductModal,
  IUpdatePriceModal,
} from 'models/IModal';

type ModalState = {
  loginModal: ILoginModal;
  ordersExportModal: IModal;
  ordersFilterModal: IModal;
  orderInfoModal: IOrderModal;
  orderShopModal: IOrderModal;
  userRegistrationModal: IUserRegistrationModal;
  orderMembersModal: IModal;
  orderDetailAddFavoriteModal: IModal;
  controlPanelEditUserModal: IEditUserModal;
  controlPanelUsersFilterModal: IModal;
  controlPanelEditTypeModal: IEditTypeModal;
  controlPanelTypesFilterModal: IModal;
  controlPanelEditShopModal: IEditShopModal;
  controlPanelShopsFilterModal: IModal;
  controlPanelEditProductModal: IEditProductModal;
  controlPanelProductsFilterModal: IModal;
  controlPanelEditParamModal: IEditParamModal;
  controlPanelParamsFilterModal: IModal;
  controlPanelEditFeatureModal: IEditFeatureModal;
  controlPanelFeaturesFilterModal: IModal;
  controlPanelEditCategoryModal: IEditCategoryModal;
  controlPanelCategoriesFilterModal: IModal;
  controlPanelEditTypeParamsModal: IEditTypeParamsModal;
  controlPanelEditEmployeeModal: IEditEmployeeModal;
  controlPanelEmployeeFilterModal: IModal;
  editUserModal: IUserModal;
  updaterModal: IModal;
  endingGoodsProductModal: IEndingGoodsProductModal;
  endingGoodsEditProductModal: IEndingGoodsEditProductModal;
  endingGoodsClearOrderedModal: IModal;
  taskMembersModal: IModal;
  tasksFilterModal: IModal;
  updatePriceModal: IUpdatePriceModal;
  defectiveGoodsModal: IModal;
};

const initialState: ModalState = {
  loginModal: INITIAL_LOGIN_MODAL,
  ordersExportModal: INITIAL_MODAL,
  ordersFilterModal: INITIAL_MODAL,
  orderInfoModal: INITIAL_ORDER_MODAL,
  orderShopModal: INITIAL_ORDER_MODAL,
  userRegistrationModal: INITIAL_USER_REGISTRATION_MODAL,
  orderMembersModal: INITIAL_MODAL,
  orderDetailAddFavoriteModal: INITIAL_MODAL,
  controlPanelEditUserModal: INITIAL_EDIT_USER_MODAL,
  controlPanelUsersFilterModal: INITIAL_MODAL,
  controlPanelEditTypeModal: INITIAL_EDIT_TYPE_MODAL,
  controlPanelTypesFilterModal: INITIAL_MODAL,
  controlPanelEditShopModal: INITIAL_EDIT_SHOP_MODAL,
  controlPanelShopsFilterModal: INITIAL_MODAL,
  controlPanelEditProductModal: INITIAL_EDIT_PRODUCT_MODAL,
  controlPanelProductsFilterModal: INITIAL_MODAL,
  controlPanelEditParamModal: INITIAL_EDIT_PARAM_MODAL,
  controlPanelParamsFilterModal: INITIAL_MODAL,
  controlPanelEditFeatureModal: INITIAL_EDIT_FEATURE_MODAL,
  controlPanelFeaturesFilterModal: INITIAL_MODAL,
  controlPanelEditCategoryModal: INITIAL_EDIT_CATEGORY_MODAL,
  controlPanelCategoriesFilterModal: INITIAL_MODAL,
  controlPanelEditTypeParamsModal: INITIAL_EDIT_TYPE_PARAMS_MODAL,
  controlPanelEditEmployeeModal: INITIAL_EDIT_EMPLOYEE_MODAL,
  controlPanelEmployeeFilterModal: INITIAL_MODAL,
  editUserModal: INITIAL_USER_MODAL,
  updaterModal: INITIAL_MODAL,
  endingGoodsProductModal: INITIAL_ENDING_GOODS_PRODUCT_MODAL,
  endingGoodsEditProductModal: INITIAL_ENDING_GOODS_EDIT_PRODUCT_MODAL,
  endingGoodsClearOrderedModal: INITIAL_MODAL,
  taskMembersModal: INITIAL_MODAL,
  tasksFilterModal: INITIAL_MODAL,
  updatePriceModal: INITIAL_UPDATE_PRICE_MODAL,
  defectiveGoodsModal: INITIAL_MODAL,
};

interface OpenModalProps<K = keyof ModalState> {
  modal: K;
  //@ts-ignore
  props?: ModalState[K];
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<OpenModalProps>) {
      //@ts-ignore
      state[action.payload.modal] = {
        ...action.payload.props,
        isShowing: true,
      };
    },
    closeModal(state, action: PayloadAction<keyof ModalState>) {
      //@ts-ignore
      state[action.payload] = initialState[action.payload];
    },
  },
});

export default modalSlice.reducer;
