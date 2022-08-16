import { IParam } from './IParam';

export interface IFeature {
  id: number;
  name: string;
  pluralName: string;
  params?: IParam[] | null;
}
