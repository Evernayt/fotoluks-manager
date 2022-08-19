import { Modes } from 'constants/app';
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
import { initialFeature } from './initialFeatureState';

export const initialModal: IModal = {
  isShowing: false,
};

export const initialOrderModal: IOrderModal = { isShowing: false, orderId: 0 };

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

export const initialEditParamsModal: IEditParamsModal = {
  isShowing: false,
  typeId: 0,
  feature: initialFeature,
};

export const initialLoginModal: ILoginModal = {
  isShowing: false,
  user: null,
};
