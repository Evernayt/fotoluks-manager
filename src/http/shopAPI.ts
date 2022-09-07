import { IShopData } from 'models/IShop';
import { $host } from './index';

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
