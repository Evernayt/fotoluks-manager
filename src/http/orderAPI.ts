import { IFinishedProduct } from 'models/IFinishedProduct';
import { IOrder, IOrderData } from 'models/IOrder';
import { IOrderInfo } from 'models/IOrderInfo';
import { $authHost, $host } from './index';

interface IFetchOrders {
  (
    limit: number,
    page: number,
    statusId: number,
    shopIds: number[],
    startDate?: string,
    endDate?: string,
    userId?: number
  ): Promise<IOrderData>;
}

export const fetchOrdersAPI: IFetchOrders = async (
  limit = 15,
  page = 1,
  statusId = 0,
  shopIds,
  startDate = '',
  endDate = '',
  userId = 0
) => {
  const { data } = await $host.post('api/order/all/', {
    limit,
    page,
    statusId,
    shopIds,
    startDate,
    endDate,
    userId,
  });
  return data;
};

interface IUpdateStatus {
  (statusId: number, orderId: number, userId: number): Promise<[]>;
}

export const updateStatusAPI: IUpdateStatus = async (
  statusId,
  orderId,
  userId
) => {
  const { data } = await $host.put(
    `api/order/updateStatus/?statusId=${statusId}&orderId=${orderId}&userId=${userId}`
  );
  return data;
};

export const fetchOrderAPI = async (orderId: number): Promise<IOrder> => {
  const { data } = await $host.get('api/order/one/' + orderId);
  return data;
};

interface ISaveOrder {
  (body: any): Promise<{ finishedProducts: IFinishedProduct[]; order: IOrder }>;
}

export const saveOrderAPI: ISaveOrder = async (body) => {
  const { data } = await $authHost.post('api/order/save', body);
  return data;
};

type OrderDataForExport = {
  id: number;
  finishedProducts: IFinishedProduct[];
  orderInfos: IOrderInfo[];
  createdAt: string;
  sum: number;
};

interface IFetchOrdersForExport {
  (startDate: string, endDate: string, shopId: number): Promise<
    OrderDataForExport[]
  >;
}

export const fetchOrdersForExportAPI: IFetchOrdersForExport = async (
  startDate,
  endDate,
  shopId
) => {
  const { data } = await $host.get(
    `api/order/allForExport/?startDate=${startDate}&endDate=${endDate}&shopId=${shopId}`
  );
  return data;
};

interface IUpdateShop {
  (orderId: number, shopId: number): Promise<[]>;
}

export const updateShopAPI: IUpdateShop = async (orderId, shopId) => {
  const { data } = await $host.put(
    `api/order/updateShop/?orderId=${orderId}&shopId=${shopId}`
  );
  return data;
};

interface ISearchOrders {
  (limit: number, page: number, searchText: string): Promise<IOrderData>;
}

export const searchOrdersAPI: ISearchOrders = async (
  limit = 15,
  page = 1,
  searchText
) => {
  const { data } = await $host.get(
    `api/order/search/?limit=${limit}&page=${page}&searchText=${searchText}`
  );
  return data;
};
