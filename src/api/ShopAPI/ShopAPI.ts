import { $host, $authHost } from 'api';
import { IShop, IShopData } from 'models/api/IShop';
import { CreateShopDto } from './dto/create-shop.dto';
import { GetShopsDto } from './dto/get-shops.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

export default class ShopAPI {
  static async create(createShopDto?: CreateShopDto): Promise<IShop> {
    const { data } = await $authHost.post('shops', createShopDto);
    return data;
  }

  static async getAll(
    getShopsDto?: GetShopsDto,
    signal?: AbortSignal
  ): Promise<IShopData> {
    const { data } = await $host.get('shops', { params: getShopsDto, signal });
    return data;
  }

  static async getOne(id: number): Promise<IShop> {
    const { data } = await $authHost.get(`shops/${id}`);
    return data;
  }

  static async update(updateShopDto?: UpdateShopDto): Promise<IShop> {
    const { data } = await $authHost.put('shops', updateShopDto);
    return data;
  }
}
