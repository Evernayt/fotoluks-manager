import { IProduct, IProductData } from 'models/IProduct';
import { $host } from './index';

interface IFetchProducts {
  (limit?: number, page?: number, archive?: boolean): Promise<IProductData>;
}

export const fetchProductsAPI: IFetchProducts = async (
  limit = 100,
  page = 1,
  archive
) => {
  const { data } = await $host.post('api/product/all', {
    limit,
    page,
    archive,
  });
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

interface ICreateProduct {
  (
    name: string,
    pluralName: string,
    description: string,
    image: string,
    categoryId: number
  ): Promise<IProduct>;
}

export const createProductAPI: ICreateProduct = async (
  name,
  pluralName,
  description,
  image,
  categoryId
) => {
  const { data } = await $host.post('api/product/create', {
    name,
    pluralName,
    description,
    image,
    categoryId,
  });
  return data;
};

interface IFetchProduct {
  (productId: number): Promise<IProduct>;
}

export const fetchProductAPI: IFetchProduct = async (productId) => {
  const { data } = await $host.get('api/product/one/' + productId);
  return data;
};

export const updateProductAPI = async (
  product: IProduct
): Promise<IProduct> => {
  const { data } = await $host.post('api/product/update', product);
  return data;
};
