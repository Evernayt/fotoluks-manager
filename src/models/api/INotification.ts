import { IData } from 'models/IData';

export interface INotification {
  id: number;
  title: string;
  text: string;
  createdAt: string;
}

export type INotificationData = IData<INotification[]>;
