import { IData } from 'models/IData';
import { IApp } from './IApp';
import { INotificationCategory } from './INotificationCategory';

export interface INotification {
  id: number;
  title: string;
  text: string;
  createdAt: string;
  app?: IApp;
  notificationCategory?: INotificationCategory;
}

export type INotificationData = IData<INotification[]>;
