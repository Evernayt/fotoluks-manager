import { IOrderInfo } from 'models/IOrderInfo';
import { $authHost, $host } from './index';

interface IFetchOrderInfo {
  (orderId: number): Promise<IOrderInfo[]>;
}

export const fetchOrderInfosAPI: IFetchOrderInfo = async (orderId) => {
  const { data } = await $host.get('api/orderInfo/all/' + orderId);
  return data;
};
