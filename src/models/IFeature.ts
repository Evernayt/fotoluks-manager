import { IParam } from './IParam';

export interface IFeature {
  id: number;
  name: string;
  params?: IParam[] | null;
}
