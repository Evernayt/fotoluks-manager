import { IBarcode } from './IBarcode';
import { IMeta } from './IMeta';
import { IProduct } from './IProduct';

export interface IVariant {
  meta: IMeta;
  id: string;
  name: string;
  product: IProduct;
  code?: string;
  barcodes?: IBarcode[];
  description?: string;
}
