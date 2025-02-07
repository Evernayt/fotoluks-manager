import { ICounterparty } from './api/moysklad/ICounterparty';
import { IAssortment } from './api/moysklad/IAssortment';

export interface IDefectiveGood {
  id: string;
  agent: ICounterparty;
  incomingNumber: string;
  assortment: IAssortment;
  quantity: number;
}
