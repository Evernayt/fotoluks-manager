import { ICategory } from 'models/ICategory';
import { $host } from './index';

export const fetchCategoriesAPI = async (): Promise<ICategory[]> => {
  const { data } = await $host.get('api/category/all');
  return data;
};
