import { ICategory, ICategoryData } from 'models/ICategory';
import { $host } from './index';

interface IFetchCategories {
  (limit?: number, page?: number, archive?: boolean): Promise<ICategoryData>;
}

export const fetchCategoriesAPI: IFetchCategories = async (
  limit = 100,
  page = 1,
  archive
) => {
  const { data } = await $host.post('api/category/all', {
    limit,
    page,
    archive,
  });
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

export const updateCategoryAPI = async (
  category: ICategory
): Promise<ICategory> => {
  const { data } = await $host.post('api/category/update', category);
  return data;
};

interface ISearchCategories {
  (limit: number, page: number, searchText: string): Promise<ICategoryData>;
}

export const searchCategoriesAPI: ISearchCategories = async (
  limit = 15,
  page = 1,
  searchText
) => {
  const { data } = await $host.get(
    `api/category/search/?limit=${limit}&page=${page}&searchText=${searchText}`
  );
  return data;
};
