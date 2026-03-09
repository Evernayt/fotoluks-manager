import { IGroup } from './IGroup';
import { IMeta } from './IMeta';

export interface IMoyskladEmployee {
  meta: IMeta;
  id: string;
  name: string;
  group: IGroup;
}
