import { IFeature, IFoundFeatures } from 'models/IFeature';

export const initialFeature: IFeature = {
  id: 0,
  name: '',
  pluralName: '',
};

export const initialFoundFeatures: IFoundFeatures = {
  featureData: { rows: [], count: 0 },
  searchText: '',
};
