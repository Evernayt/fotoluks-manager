import {
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
