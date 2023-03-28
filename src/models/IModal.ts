import { Modes } from 'constants/app';
import { IEmployee } from './api/IEmployee';
import { IFeature } from './api/IFeature';
import { IOrder } from './api/IOrder';
import { INotification } from './api/moysklad/INotification';

export interface IModal {
  isShowing?: boolean;
}

export interface ILoginModal extends IModal {
  employee: IEmployee | null;
}

export interface IOrderModal extends IModal {
  order: IOrder | null;
}

export interface IUserRegistrationModal extends IModal {
  text: string;
}

export interface IEditUserModal extends IModal {
  userId: number;
  mode: Modes;
}

export interface IEditTypeModal extends IModal {
  typeId: number;
  mode: Modes;
}

export interface IEditShopModal extends IModal {
  shopId: number;
  mode: Modes;
}

export interface IEditProductModal extends IModal {
  productId: number;
  mode: Modes;
}

export interface IEditParamModal extends IModal {
  paramId: number;
  mode: Modes;
}

export interface IEditFeatureModal extends IModal {
  featureId: number;
  mode: Modes;
}

export interface IEditCategoryModal extends IModal {
  categoryId: number;
  mode: Modes;
}

export interface IUserModal extends IModal {
  phone: string;
}

export interface IEditTypeParamsModal extends IModal {
  typeId: number;
  feature: IFeature | null;
}

export interface IEditEmployeeModal extends IModal {
  employeeId: number;
  mode: Modes;
}

export interface IEndingGoodsProductModal extends IModal {
  notification: INotification | null;
}

export interface IEndingGoodsEditProductModal extends IModal {
  productId: string;
  type: string;
}

export interface IUpdatePriceModal extends IModal {
  id: string;
  name: string;
}
