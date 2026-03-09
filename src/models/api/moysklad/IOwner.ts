import { IGroup } from './IGroup';
import { IMeta } from './IMeta';

export interface IOwner {
  meta: IMeta;
  id: string;
  name: string;
  group: IGroup;
}
