import { IAssortment } from './IAssortment';
import { IGtd } from './IGtd';

export interface IPosition {
  id?: string;
  quantity: number;
  assortment: IAssortment;
  price?: number;
  reason?: string;
  gtd?: IGtd;
}
