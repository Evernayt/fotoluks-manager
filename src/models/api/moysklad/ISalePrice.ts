import { IMeta } from './IMeta';

interface IPriceType {
  meta: IMeta;
  id: string;
  name: string;
  externalCode: string;
}

export interface ISalePrice {
  value: number;
  currency: IMeta;
  priceType: IPriceType;
}
