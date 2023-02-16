import { GetCategoriesDto } from 'api/CategoryAPI/dto/get-categories.dto';
import { IFilter } from 'models/IFilter';
import { IData } from '../IData';

export interface ICategory {
  id: number;
  name: string;
  archive: boolean;
}

export type ICategoryData = IData<ICategory[]>;

export interface ICategoriesFilter extends Partial<IFilter>, GetCategoriesDto {}
