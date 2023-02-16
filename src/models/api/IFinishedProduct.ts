import { IProduct } from './IProduct';
import { ISelectedParam } from './ISelectedParam';
import { IType } from './IType';

export interface IFinishedProduct {
  id: number | string;
  price: number;
  quantity: number;
  comment: string;
  folder: string;
  product?: IProduct;
  type?: IType;
  selectedParams?: ISelectedParam[];
}
