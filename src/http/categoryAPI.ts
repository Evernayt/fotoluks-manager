import { ICategory } from 'models/ICategory';
import { $host } from './index';

export const fetchCategoriesAPI = async (): Promise<ICategory[]> => {
  const { data } = await $host.get('api/category/all');
  return data;
};

export const createCategoryAPI = async (name: string): Promise<ICategory> => {
  const { data } = await $host.post('api/category/create', { name });
  return data;
};
