import { IBarcode } from './IBarcode';
import { IMeta } from './IMeta';

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
}
