import { IAgent } from './IAgent';
import { IMeta } from './IMeta';

export interface ISupply {
  meta: IMeta;
  id: string;
  created: string;
  name: string;
  sum: number;
  incomingDate?: string;
  incomingNumber: string;
  description: string;
  agent: IAgent;
}
