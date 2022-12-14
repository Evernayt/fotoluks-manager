import { IFilter } from './IFilter';
import { IProduct } from './IProduct';

export interface ICategory {
  id: number;
  name: string;
  products?: IProduct[];
  archive?: boolean;
}

export interface ICategoryData {
  rows: ICategory[];
  count: number;
}

export interface ICategoriesFilter {
  filter: IFilter;
  archive: boolean;
}

export interface IFoundCategories {
  categoryData: ICategoryData;
  searchText: string;
}
