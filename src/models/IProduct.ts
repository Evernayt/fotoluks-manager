import { ICategory } from './ICategory';
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
