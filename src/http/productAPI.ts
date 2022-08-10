import { IProduct } from 'models/IProduct';
import { $host } from './index';

export const fetchProductsAPI = async (): Promise<IProduct[]> => {
  const { data } = await $host.get('api/product/all');
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
