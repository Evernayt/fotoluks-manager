import { IFeature } from './IFeature';

export interface IParam {
  id: number;
  value: string;
  name: string;
  feature?: IFeature;
  featureId?: number;
}
