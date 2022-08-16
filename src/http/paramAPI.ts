import { IParam } from 'models/IParam';
import { $host } from './index';

export const fetchParamsAPI = async (featureId: number): Promise<IParam[]> => {
  const { data } = await $host.get('api/param/all/' + featureId);
  return data;
};
