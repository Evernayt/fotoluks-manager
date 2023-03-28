import { IMeta } from './IMeta';

export interface ISupply {
  meta: IMeta;
  id: string;
  created: string;
  name: string;
  sum: number;
  incomingNumber: string;
  description: string;
}
