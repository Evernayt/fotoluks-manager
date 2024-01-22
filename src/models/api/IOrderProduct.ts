import { IProduct } from './IProduct';

export interface IOrderProduct {
  id: number | string;
  price: number;
  quantity: number;
  comment: string;
  folder: string;
  discount: number | null;
  product?: IProduct;
}
