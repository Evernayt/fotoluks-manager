import { IFavoriteParam } from './IFavoriteParam';
import { IType } from './IType';

export interface IFavorite {
  id: number;
  type: IType;
  favoriteParams: IFavoriteParam[];
}
