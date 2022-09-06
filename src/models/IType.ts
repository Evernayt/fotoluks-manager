import { IFeature } from './IFeature';
import { IFilter } from './IFilter';
import { IParam } from './IParam';
import { IProduct } from './IProduct';

export interface IType {
  id: number;
  name: string;
  price: number;
  image: string;
  features?: IFeature[];
  product?: IProduct;
  params?: IParam[];
  archive?: boolean;
}

export interface ITypeData {
  rows: IType[];
  count: number;
}

export interface ITypesFilter {
  filter: IFilter;
  archive: boolean;
}

export interface IFoundTypes {
  typeData: ITypeData;
  searchText: string;
}
