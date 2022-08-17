import { ICategory } from './ICategory';
import { IFilter } from './IFilter';
import { IType } from './IType';

export interface IProduct {
  id: number;
  name: string;
  pluralName: string;
  description: string;
  image: string;
  category?: ICategory;
  types?: IType[];
}

export interface IProductData {
  rows: IProduct[];
  count: number;
}

export interface IProductsFilter {
  filter: IFilter;
}

export interface IFoundProducts {
  productData: IProductData;
  searchText: string;
}