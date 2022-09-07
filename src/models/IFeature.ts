import { IFilter } from './IFilter';

export interface IFeature {
  id: number;
  name: string;
  pluralName: string;
  archive?: boolean;
}

export interface IFeatureData {
  rows: IFeature[];
  count: number;
}

export interface IFeaturesFilter {
  filter: IFilter;
  archive: boolean;
}

export interface IFoundFeatures {
  featureData: IFeatureData;
  searchText: string;
}
