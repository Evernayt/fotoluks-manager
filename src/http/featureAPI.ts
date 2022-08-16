import { IFeature } from 'models/IFeature';
import { $host } from './index';

export const fetchFeaturesAPI = async (): Promise<IFeature[]> => {
  const { data } = await $host.get('api/feature/all');
  return data;
};
