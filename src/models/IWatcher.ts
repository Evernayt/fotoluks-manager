import { IEmployee } from './api/IEmployee';

export interface IWatcher {
  socketId?: string;
  employee: IEmployee;
  orderId: number;
}
