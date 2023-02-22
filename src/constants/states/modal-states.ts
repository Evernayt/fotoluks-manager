import { IEndingGoodsEditProductModal } from './../../models/IModal';
import { Modes } from 'constants/app';
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
} from 'models/IModal';
import { INITIAL_FEATURE } from './feature-states';

export const INITIAL_MODAL: IModal = {
  isShowing: false,
};

export const INITIAL_LOGIN_MODAL: ILoginModal = {
  ...INITIAL_MODAL,
  employee: null,
};

export const INITIAL_ORDER_MODAL: IOrderModal = {
  ...INITIAL_MODAL,
  order: null,
};

export const INITIAL_USER_REGISTRATION_MODAL: IUserRegistrationModal = {
  ...INITIAL_MODAL,
  text: '',
};

export const INITIAL_EDIT_USER_MODAL: IEditUserModal = {
  ...INITIAL_MODAL,
  userId: 0,
  mode: Modes.ADD_MODE,
};

export const INITIAL_EDIT_TYPE_MODAL: IEditTypeModal = {
  ...INITIAL_MODAL,
  typeId: 0,
  mode: Modes.ADD_MODE,
};

export const INITIAL_EDIT_SHOP_MODAL: IEditShopModal = {
  ...INITIAL_MODAL,
  shopId: 0,
  mode: Modes.ADD_MODE,
};

export const INITIAL_EDIT_PRODUCT_MODAL: IEditProductModal = {
  ...INITIAL_MODAL,
  productId: 0,
  mode: Modes.ADD_MODE,
};

export const INITIAL_EDIT_PARAM_MODAL: IEditParamModal = {
  ...INITIAL_MODAL,
  paramId: 0,
  mode: Modes.ADD_MODE,
};

export const INITIAL_EDIT_FEATURE_MODAL: IEditFeatureModal = {
  ...INITIAL_MODAL,
  featureId: 0,
  mode: Modes.ADD_MODE,
};

export const INITIAL_EDIT_CATEGORY_MODAL: IEditCategoryModal = {
  ...INITIAL_MODAL,
  categoryId: 0,
  mode: Modes.ADD_MODE,
};

export const INITIAL_USER_MODAL: IUserModal = {
  ...INITIAL_MODAL,
  phone: '',
};

export const INITIAL_EDIT_TYPE_PARAMS_MODAL: IEditTypeParamsModal = {
  ...INITIAL_MODAL,
  typeId: 0,
  feature: INITIAL_FEATURE,
};

export const INITIAL_EDIT_EMPLOYEE_MODAL: IEditEmployeeModal = {
  ...INITIAL_MODAL,
  employeeId: 0,
  mode: Modes.ADD_MODE,
};

export const INITIAL_ENDING_GOODS_PRODUCT_MODAL: IEndingGoodsProductModal = {
  ...INITIAL_MODAL,
  notification: null,
};

export const INITIAL_ENDING_GOODS_EDIT_PRODUCT_MODAL: IEndingGoodsEditProductModal =
  {
    ...INITIAL_MODAL,
    productId: '',
  };
