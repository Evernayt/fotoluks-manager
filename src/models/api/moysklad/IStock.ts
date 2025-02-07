import { IMeta } from './IMeta';
import { IPosition } from './IPosition';
import { IStore } from './IStore';

export interface IStock {
  meta: IMeta;
  stockByStore: IStore[];
}

export interface IStockField {
  quantity: number;
}

export interface IStockByOperation {
  meta?: IMeta;
  positions?: IPosition[];
}
