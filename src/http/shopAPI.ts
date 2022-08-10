import { IShop } from 'models/IShop';
import { $host } from './index';

interface IFetchShops {
  (inclusiveGeneral?: boolean): Promise<IShop[]>;
}

export const fetchShopsAPI: IFetchShops = async (inclusiveGeneral = false) => {
  const { data } = await $host.get(
    `api/shop/all/?inclusiveGeneral=${inclusiveGeneral}`
  );
  return data;
};
