import { IBarcode } from './IBarcode';
import { IMeta } from './IMeta';
import { IProduct } from './IProduct';
import { ISalePrice } from './ISalePrice';
import { IBuyPrice } from './IBuyPrice';
import { IProductFolder } from './IProductFolder';
import { ISupplier } from './ISupplier';

export interface IAssortment {
  meta: IMeta;
  id: string;
  updated: string;
  name: string;
  barcodes: IBarcode[];
  discountProhibited: boolean;
  article?: string;
  code?: string;
  stock?: number;
  description?: string;
  minimumBalance?: number;
  salePrices?: ISalePrice[];
  product?: IProduct;
  buyPrice?: IBuyPrice;
  productFolder?: IProductFolder;
  supplier?: ISupplier;
}
