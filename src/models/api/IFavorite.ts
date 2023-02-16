import { IData } from 'models/IData';
import { IFavoriteParam } from './IFavoriteParam';
import { IType } from './IType';

export interface IFavorite {
  id: number;
  type?: IType;
  favoriteParams?: IFavoriteParam[];
}

export type IFavoriteData = IData<IFavorite[]>;
