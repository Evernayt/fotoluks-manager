import { IFilter } from './IFilter';
import { IFinishedProduct } from './IFinishedProduct';
import { IOrderMember } from './IOrderMember';
import { IShop } from './IShop';
import { IStatus } from './IStatus';
import { IUser } from './IUser';

export interface IOrder {
  id: number;
  user?: IUser | null;
  status?: IStatus | null;
  shop?: IShop | null;
  finishedProducts: IFinishedProduct[];
  deadline: string;
  createdAt: string;
  prepayment: number;
  sum: number;
  comment: string;
  orderMembers: IOrderMember[];
  ordersCount?: number;
}

export interface IOrderData {
  rows: IOrder[];
  count: number;
}

export interface IFoundOrders {
  orderData: IOrderData;
  searchText: string;
}

export interface IOrdersFilter {
  filter: IFilter;
  shop: IShop;
  startDate: string;
  endDate: string;
}
