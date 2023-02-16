import { GetShopsDto } from 'api/ShopAPI/dto/get-shops.dto';
import { IData } from '../IData';
import { IFilter } from '../IFilter';

export interface IShop {
  id: number;
  name: string;
  address: string;
  description: string;
  abbreviation: string;
  archive: boolean;
}

export type IShopData = IData<IShop[]>;

export interface IShopsFilter extends Partial<IFilter>, GetShopsDto {}
