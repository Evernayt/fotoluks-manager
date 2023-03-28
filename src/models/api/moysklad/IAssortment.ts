import { IBarcode } from './IBarcode';
import { IMeta } from './IMeta';
import { IProduct } from './IProduct';
import { ISalePrice } from './ISalePrice';

export interface IAssortment {
  meta: IMeta;
  id: string;
  updated: string;
  name: string;
  barcodes: IBarcode[];
  article?: string;
  code?: string;
  stock?: number;
  description?: string;
  salePrices?: ISalePrice[];
  product?: IProduct;
}
