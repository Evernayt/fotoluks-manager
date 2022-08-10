import { IStatus } from './IStatus';
import { IUser } from './IUser';

export interface IOrderInfo {
  id: number;
  status: IStatus;
  user: IUser;
  createdAt: string;
}
