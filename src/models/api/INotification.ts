import { IData } from 'models/IData';
import { IApp } from './IApp';

export interface INotification {
  id: number;
  title: string;
  text: string;
  createdAt: string;
  app?: IApp;
}

export type INotificationData = IData<INotification[]>;
