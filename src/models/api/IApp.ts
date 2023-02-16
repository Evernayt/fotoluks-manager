import { IData } from 'models/IData';

export interface IApp {
  id: number;
  value: string;
  description: string;
}

export type IAppData = IData<IApp[]>;
