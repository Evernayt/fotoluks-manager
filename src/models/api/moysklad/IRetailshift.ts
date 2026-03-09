import { IOwner } from './IOwner';

export interface IRetailshift {
  id: string;
  name: string;
  moment: string;
  closeDate: string;
  owner: IOwner;
}
