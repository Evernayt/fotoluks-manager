import { IData } from '../IData';
import { IEmployee } from './IEmployee';

export interface IReport {
  id: number;
  createdAt: string;
  description: string;
  completed: boolean;
  employee?: IEmployee;
}

export type IReportData = IData<IReport[]>;
