import { IMeta } from './IMeta';
import { IStore } from './IStore';

export interface IMove {
  meta: IMeta;
  id: string;
  created: string;
  sourceStore: IStore;
  targetStore: IStore;
}
