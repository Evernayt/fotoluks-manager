import { ICategory } from './ICategory';
import { IFilter } from './IFilter';
import { IType } from './IType';

export interface IProduct {
  id: number;
  name: string;
  pluralName: string;
  description: string;
  image: string;
  categoryId?: number;
  category?: ICategory;
  types?: IType[];
  archive?: boolean;
}

export interface IProductData {
  rows: IProduct[];
  count: number;
}

export interface IProductsFilter {
  filter: IFilter;
  archive: boolean;
}

export interface IFoundProducts {
  productData: IProductData;
  searchText: string;
}
