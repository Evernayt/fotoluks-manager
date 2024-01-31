import { IEmployee } from './api/IEmployee';
import { MODES } from 'constants/app';
import { IOrderProduct } from './api/IOrderProduct';
import { IOrder } from './api/IOrder';
import { IEndingGood } from 'pages/moysklad-page/components/tables/ending-goods/EndingGoodsTable';
import { ITaskMessage } from './api/ITaskMessage';
import { IStatus } from './api/IStatus';

export interface IModal {
  isOpen: boolean;
}

export interface ILoginModal extends IModal {
  employee?: IEmployee;
}

export interface IProductsEditModal extends IModal {
  productId?: number;
  mode?: MODES;
}

export interface IEmployeesEditModal extends IModal {
  employeeId?: number;
  mode?: MODES;
}

export interface IUsersEditModal extends IModal {
  userId?: number;
  mode?: MODES;
}

export interface IShopsEditModal extends IModal {
  shopId?: number;
  mode?: MODES;
}

export interface IOrderClientEditModal extends IModal {
  phone?: string;
  searchText?: string;
  mode?: MODES;
}

export interface IOrderProductEditModal extends IModal {
  orderProduct?: IOrderProduct;
  mode?: MODES;
}

export interface IOrdersInfoModal extends IModal {
  order?: IOrder;
}

export interface IOrdersShopModal extends IModal {
  order?: IOrder;
}

export interface IEndingGoodsProductModal extends IModal {
  endingGood?: IEndingGood;
}

export interface IUpdatePricesModal extends IModal {
  id?: string;
  name?: string;
}

export interface ITaskEditMessageModal extends IModal {
  taskMessage?: ITaskMessage | null;
}

export interface IOrdersReasonModal extends IModal {
  status?: IStatus;
  order?: IOrder;
  updateOpenedOrderStatus?: boolean;
}

export interface IChangelogsEditModal extends IModal {
  changelogId?: number;
  version?: string;
  mode?: MODES;
}
