import { IData } from 'models/IData';
import { IProduct } from './IProduct';

export interface IFavorite {
  id: number;
  productId: number;
  product?: IProduct;
}

export type IFavoriteData = IData<IFavorite[]>;
