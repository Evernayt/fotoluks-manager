import { IMeta } from './IMeta';
import { IStore } from './IStore';

export interface IMove {
  meta: IMeta;
  id: string;
  name: string;
  created: string;
  deleted?: string;
  description: string;
  sourceStore: IStore;
  targetStore: IStore;
}
