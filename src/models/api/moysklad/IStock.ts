import { IMeta } from './IMeta';
import { IStore } from './IStore';

export interface IStock {
  meta: IMeta;
  stockByStore: IStore[];
}
