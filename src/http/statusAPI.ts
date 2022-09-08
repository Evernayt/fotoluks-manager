import { IStatus } from 'models/IStatus';
import { $authHost } from './index';

export const fetchStatusesAPI = async (): Promise<IStatus[]> => {
  const { data } = await $authHost.get('api/status/all');
  return data;
};

interface IFetchStatusOrders {
  (userId: number, startDate?: string, endDate?: string): Promise<IStatus[]>;
}

export const fetchStatusOrdersAPI: IFetchStatusOrders = async (
  userId,
  startDate,
  endDate
) => {
  const { data } = await $authHost.get(
    `api/status/orders/?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
  );
  return data;
};
