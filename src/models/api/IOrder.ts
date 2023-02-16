import { GetOrdersDto } from 'api/OrderAPI/dto/get-orders.dto';
import { IFilter } from 'models/IFilter';
import { IData } from '../IData';
import { IFinishedProduct } from './IFinishedProduct';
import { IOrderInfo } from './IOrderInfo';
import { IOrderMember } from './IOrderMember';
import { IShop } from './IShop';
import { IStatus } from './IStatus';
import { IUser } from './IUser';

export interface IOrder {
  id: number;
  createdAt: string;
  deadline: string;
  prepayment: number;
  sum: number;
  comment: string;
  status?: IStatus;
  shop?: IShop;
  user?: IUser | null;
  finishedProducts?: IFinishedProduct[];
  orderInfos?: IOrderInfo[];
  orderMembers?: IOrderMember[];
}

export type IOrderData = IData<IOrder[]>;

export interface IOrdersFilter extends Partial<IFilter>, GetOrdersDto {}
