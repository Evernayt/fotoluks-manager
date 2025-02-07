import { ICounterparty } from './ICounterparty';
import { IAttribute } from './IAttribute';
import { IMeta } from './IMeta';
import { IStore } from './IStore';
import { IPosition } from './IPosition';
import { IMoyskladData } from './IMoyskladData';

export interface ISupply {
  meta: IMeta;
  id: string;
  created: string;
  moment: string;
  name: string;
  sum: number;
  incomingDate?: string;
  incomingNumber: string;
  description: string;
  applicable: boolean;
  agent: ICounterparty;
  store: IStore;
  attributes: IAttribute[];
  positions: IMoyskladData<IPosition>;
}
