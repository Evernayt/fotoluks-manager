import { IMeta } from './IMeta';

export interface IAttribute {
  id: string;
  meta: IMeta;
  name: string;
  type: string;
  value: any;
}
