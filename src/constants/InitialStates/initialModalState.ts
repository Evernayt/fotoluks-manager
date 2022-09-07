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
} from 'models/IModal';
import { initialFeature } from './initialFeatureState';

export const initialModal: IModal = {
  isShowing: false,
};

export const initialOrderModal: IOrderModal = { isShowing: false, order: null };

export const initialUserRegistrationModal: IUserRegistrationModal = {
  isShowing: false,
  text: '',
};

export const initialUserModal: IUserModal = {
  isShowing: false,
  phone: '',
};

export const initialEditTypeModal: IEditTypeModal = {
  isShowing: false,
  typeId: 0,
  mode: Modes.ADD_MODE,
};

export const initialEditProductModal: IEditProductModal = {
  isShowing: false,
  productId: 0,
  mode: Modes.ADD_MODE,
};

export const initialEditCategoryModal: IEditCategoryModal = {
  isShowing: false,
  categoryId: 0,
  mode: Modes.ADD_MODE,
};

export const initialEditTypeParamsModal: IEditTypeParamsModal = {
  isShowing: false,
  typeId: 0,
  feature: initialFeature,
};

export const initialLoginModal: ILoginModal = {
  isShowing: false,
  user: null,
};

export const initialEditFeatureModal: IEditFeatureModal = {
  isShowing: false,
  featureId: 0,
  mode: Modes.ADD_MODE,
};

export const initialEditParamModal: IEditParamModal = {
  isShowing: false,
  paramId: 0,
  mode: Modes.ADD_MODE,
};

export const initialEditShopModal: IEditShopModal = {
  isShowing: false,
  shopId: 0,
  mode: Modes.ADD_MODE,
};

export const initialEditUserModal: IEditUserModal = {
  isShowing: false,
  userId: 0,
  mode: Modes.ADD_MODE,
};
