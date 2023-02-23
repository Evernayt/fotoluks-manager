import { IEmployee } from './api/IEmployee';

export interface IWatcher {
  employee: IEmployee;
  orderId: number;
  socketId?: string;
}
