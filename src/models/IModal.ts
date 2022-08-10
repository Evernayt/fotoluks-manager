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