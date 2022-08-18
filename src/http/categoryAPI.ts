import { ICategory, ICategoryData } from 'models/ICategory';
import { $host } from './index';

interface IFetchCategories {
  (limit?: number, page?: number): Promise<ICategoryData>;
}

export const fetchCategoriesAPI: IFetchCategories = async (
  limit = 100,
  page = 1
) => {
  const { data } = await $host.get(
    `api/category/all/?limit=${limit}&page=${page}`
  );
  return data;
};

export const createCategoryAPI = async (name: string): Promise<ICategory> => {
  const { data } = await $host.post('api/category/create', { name });
  return data;
};

interface IFetchCategory {
  (categoryId: number): Promise<ICategory>;
}

export const fetchCategoryAPI: IFetchCategory = async (categoryId) => {
  const { data } = await $host.get('api/category/one/' + categoryId);
  return data;
};

interface IUpdateCategory {
  (id: number, name: string): Promise<number[]>;
}

export const updateCategoryAPI: IUpdateCategory = async (id, name) => {
  const { data } = await $host.post('api/category/update', {
    id,
    name,
  });
  return data;
};
