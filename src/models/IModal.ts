import { Modes } from 'constants/app';
import { IFeature } from './IFeature';
import { IOrder } from './IOrder';
import { IUser } from './IUser';

export interface IModal {
  isShowing: boolean;
}

export interface IOrderModal {
  isShowing: boolean;
  order: IOrder | null;
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

export interface IEditCategoryModal {
  isShowing: boolean;
  categoryId: number;
  mode: Modes;
}

export interface IEditParamsModal {
  isShowing: boolean;
  typeId: number;
  feature: IFeature;
}

export interface ILoginModal {
  isShowing: boolean;
  user: IUser | null;
}

export interface IEditFeatureModal {
  isShowing: boolean;
  featureId: number;
  mode: Modes;
}
