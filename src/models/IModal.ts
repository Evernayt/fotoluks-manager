import { Modes } from 'constants/app';

export interface IModal {
  isShowing: boolean;
}

export interface IOrderModal {
  isShowing: boolean;
  orderId: number;
}

export interface IUserRegistrationModal {
  isShowing: boolean;
  text: string;
}

export interface IUserModal {
  isShowing: boolean;
  phone: string;
}

export interface IEditTypeModal {
  isShowing: boolean;
  typeId: number;
  mode: Modes;
}

export interface IEditProductModal {
  isShowing: boolean;
  productId: number;
  mode: Modes;
}
