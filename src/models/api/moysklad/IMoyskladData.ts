import { IMeta } from './IMeta';

interface IDataMeta extends IMeta {
  size: number;
  limit: number;
  offset: number;
}

export interface IMoyskladData<T> {
  meta: IDataMeta;
  rows: T[];
}
