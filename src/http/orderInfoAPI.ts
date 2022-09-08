import { IOrderInfo } from 'models/IOrderInfo';
import { $authHost } from './index';

interface IFetchOrderInfo {
  (orderId: number): Promise<IOrderInfo[]>;
}

export const fetchOrderInfosAPI: IFetchOrderInfo = async (orderId) => {
  const { data } = await $authHost.get('api/orderInfo/all/' + orderId);
  return data;
};
