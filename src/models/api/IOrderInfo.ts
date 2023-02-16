import { IData } from 'models/IData';
import { IEmployee } from './IEmployee';
import { IStatus } from './IStatus';

export interface IOrderInfo {
  id: number;
  createdAt: string;
  status?: IStatus;
  employee?: IEmployee;
}

export type IOrderInfoData = IData<IOrderInfo[]>;

export interface IStatistic {
  id: number;
  count: number;
}

interface IStatisticData<T> {
  rows: T;
  count: IStatistic[];
}

export type IOrderInfoStatisticData = IStatisticData<IOrderInfo[]>;
