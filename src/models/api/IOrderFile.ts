import { IOrder } from './IOrder';
import { IOrderProduct } from './IOrderProduct';

export interface IOrderFile {
  id: number | string;
  name: string;
  size: number;
  orderProductId: number | string;
  createdAt?: string;
  link?: string;
  order?: IOrder;
  orderProduct?: IOrderProduct;
  isWaitingUploading?: boolean;
}
