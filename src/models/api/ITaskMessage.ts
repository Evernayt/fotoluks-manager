import { IData } from 'models/IData';
import { IEmployee } from './IEmployee';

export interface ITaskMessage {
  id: number;
  message: string;
  createdAt: string;
  taskId: number;
  employee: IEmployee;
  edited: boolean;
}

export type ITaskMessageData = IData<ITaskMessage[]>;
