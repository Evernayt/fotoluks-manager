import { IAssortment } from './IAssortment';
import { IGtd } from './IGtd';
import { IStockField } from './IStock';

export interface IPosition {
  id?: string;
  quantity: number;
  assortment?: IAssortment;
  price?: number;
  reason?: string;
  gtd?: IGtd;
  name?: string;
  stock?: IStockField;
  isNewPosition?: boolean;
}
