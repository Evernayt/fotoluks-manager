import { IFeature } from './IFeature';
import { IFilter } from './IFilter';

export interface IParam {
  id: number;
  value: string;
  name: string;
  feature?: IFeature;
  featureId?: number;
  archive?: boolean;
}

export interface IParamData {
  rows: IParam[];
  count: number;
}

export interface IParamsFilter {
  filter: IFilter;
  archive: boolean;
}

export interface IFoundParams {
  paramData: IParamData;
  searchText: string;
}
