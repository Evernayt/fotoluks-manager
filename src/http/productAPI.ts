import { IProduct, IProductData } from 'models/IProduct';
import { $host } from './index';

interface IFetchProducts {
  (limit?: number, page?: number): Promise<IProductData>;
}

export const fetchProductsAPI: IFetchProducts = async (
  limit = 100,
  page = 1
) => {
  const { data } = await $host.get(
    `api/product/all/?limit=${limit}&page=${page}`
  );
  return data;
};

interface ISearchProducts {
  (limit: number, page: number, searchText: string): Promise<IProduct[]>;
}

export const searchProductsAPI: ISearchProducts = async (
  limit = 15,
  page = 1,
  searchText
) => {
  const { data } = await $host.get(
    `api/product/search/?limit=${limit}&page=${page}&searchText=${searchText}`
  );
  return data;
};
