import { GetProductsDto } from 'api/ProductAPI/dto/get-products.dto';
import { IData } from 'models/IData';
import { IFilter } from 'models/IFilter';

export interface IProduct {
  id: number;
  name: string;
  moyskladId: string;
  price: number;
  discountProhibited: boolean;
  moyskladSynchronizedAt: string | null;
  image: string | null;
  archive: boolean;
}

export type IProductData = IData<IProduct[]>;

export interface IProductsFilter extends Partial<IFilter>, GetProductsDto {}
