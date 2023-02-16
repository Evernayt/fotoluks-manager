import { IMeta } from './IMeta';
import { IStore } from './IStore';

export interface ILoss {
  meta: IMeta;
  id: string;
  updated: string;
  store: IStore;
}
