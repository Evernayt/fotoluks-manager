import { IUser } from './IUser';

export interface IWatcher {
  socketId?: string;
  user: IUser;
  orderId: number;
}
