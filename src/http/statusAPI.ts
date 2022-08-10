import { IStatus } from 'models/IStatus';
import { $host } from './index';

export const fetchStatusesAPI = async (): Promise<IStatus[]> => {
  const { data } = await $host.get('api/status/all');
  return data;
};
