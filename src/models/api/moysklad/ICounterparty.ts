import { IDiscount } from './IDiscount';

export interface ICounterparty {
  id: string;
  name: string;
  phone: string;
  discounts: IDiscount[];
}
