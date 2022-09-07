import { IFilter } from './IFilter';

export interface IShop {
  id: number;
  name: string;
  address: string;
  description: string;
  archive?: boolean;
}

export interface IShopData {
  rows: IShop[];
  count: number;
}

export interface IShopsFilter {
  filter: IFilter;
  archive: boolean;
}

export interface IFoundShops {
  shopData: IShopData;
  searchText: string;
}
