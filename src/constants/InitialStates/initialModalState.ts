import { Modes } from 'constants/app';
import {
  IEditProductModal,
  IEditTypeModal,
  IModal,
  IOrderModal,
  IUserModal,
  IUserRegistrationModal,
} from 'models/IModal';

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
