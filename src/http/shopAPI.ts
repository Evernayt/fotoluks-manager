import { IShop, IShopData } from 'models/IShop';
import { $host, $authHost } from './index';

interface IFetchShops {
  (
    limit?: number,
    page?: number,
    inclusiveGeneral?: boolean,
    archive?: boolean
  ): Promise<IShopData>;
}

export const fetchShopsAPI: IFetchShops = async (
  limit = 100,
  page = 1,
  inclusiveGeneral = false,
  archive
) => {
  const { data } = await $host.post('api/shop/all/', {
    limit,
    page,
    inclusiveGeneral,
    archive,
  });
  return data;
};

interface ISearchShops {
  (limit: number, page: number, searchText: string): Promise<IShopData>;
}

export const searchShopsAPI: ISearchShops = async (
  limit = 15,
  page = 1,
  searchText
) => {
  const { data } = await $authHost.get(
    `api/shop/search/?limit=${limit}&page=${page}&searchText=${searchText}`
  );
  return data;
};

export const updateShopAPI = async (shop: IShop): Promise<IShop> => {
  const { data } = await $authHost.post('api/shop/update', shop);
  return data;
};

interface IFetchShop {
  (shopId: number): Promise<IShop>;
}

export const fetchShopAPI: IFetchShop = async (shopId) => {
  const { data } = await $authHost.get('api/shop/one/' + shopId);
  return data;
};

interface ICreateShop {
  (name: string, description: string, address: string): Promise<IShop>;
}

export const createShopAPI: ICreateShop = async (
  name,
  description,
  address
) => {
  const { data } = await $authHost.post('api/shop/create', {
    name,
    description,
    address,
  });
  return data;
};
