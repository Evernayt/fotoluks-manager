import { IAssortment } from './IAssortment';

export interface IPosition {
  id?: string;
  quantity: number;
  assortment: IAssortment;
  price?: number;
  reason?: string;
}
