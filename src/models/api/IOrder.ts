import { GetOrdersDto } from 'api/OrderAPI/dto/get-orders.dto';
import { IFilter } from 'models/IFilter';
import { IData } from '../IData';
import { IOrderInfo } from './IOrderInfo';
import { IOrderMember } from './IOrderMember';
import { IShop } from './IShop';
import { IStatus } from './IStatus';
import { IUser } from './IUser';
import { IOrderProduct } from './IOrderProduct';
import { IOrderFile } from './IOrderFile';

export interface IOrder {
  id: number;
  createdAt: string;
  deadline: string;
  prepayment: number;
  sum: number;
  discount: number;
  comment: string;
  status?: IStatus;
  shop?: IShop;
  user?: IUser | null;
  orderProducts?: IOrderProduct[];
  orderInfos?: IOrderInfo[];
  orderMembers?: IOrderMember[];
  orderFiles?: IOrderFile[];
}

export type IOrderData = IData<IOrder[]>;

export interface IOrdersFilter extends Partial<IFilter>, GetOrdersDto {}
