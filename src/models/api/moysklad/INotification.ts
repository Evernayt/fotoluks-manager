import { IGood } from './IGood';

export interface INotification {
  id: string;
  actualBalance: number;
  good: IGood;
}
