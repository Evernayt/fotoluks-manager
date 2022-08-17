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

interface IUpdateProduct {
  (
    id: number,
    name: string,
    pluralName: string,
    description: string,
    image: string,
    categoryId: number
  ): Promise<number[]>;
}

export const updateProductAPI: IUpdateProduct = async (
  id,
  name,
  pluralName,
  description,
  image,
  categoryId
) => {
  const { data } = await $host.post('api/product/update', {
    id,
    name,
    pluralName,
    description,
    image,
    categoryId,
  });
  return data;
};
