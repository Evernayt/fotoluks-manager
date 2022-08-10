import { ICategoryData } from 'models/ICategory';
import { $host } from './index';

interface IFetchCategories {
  (limit: number, page: number): Promise<ICategoryData>;
}

export const fetchCategoriesAPI: IFetchCategories = async (
  limit = 15,
  page = 1
) => {
  const { data } = await $host.post('api/category/allFull', {
    limit,
    page,
  });
  return data;
};
