import { IAgent } from './api/moysklad/IAgent';
import { IAssortment } from './api/moysklad/IAssortment';

export interface IDefectiveGood {
  id: string;
  agent: IAgent;
  incomingNumber: string;
  assortment: IAssortment;
  quantity: number;
}
