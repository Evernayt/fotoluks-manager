export interface INotification {
  id: number;
  title: string;
  text: string;
  createdAt: string;
}

export interface INotificationData {
  rows: INotification[];
  count: number;
}
