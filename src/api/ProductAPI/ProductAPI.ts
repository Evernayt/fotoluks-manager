import { $authHost } from 'api';
import { IProduct, IProductData } from 'models/api/IProduct';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export default class ProductAPI {
  static async create(greateProductDto?: CreateProductDto): Promise<IProduct> {
    const { data } = await $authHost.post('products', greateProductDto);
    return data;
  }

  static async getAll(getProductsDto?: GetProductsDto): Promise<IProductData> {
    const { data } = await $authHost.get('products', {
      params: getProductsDto,
    });
    return data;
  }

  static async getOne(id: number): Promise<IProduct> {
    const { data } = await $authHost.get(`products/${id}`);
    return data;
  }

  static async update(updateProductDto?: UpdateProductDto): Promise<IProduct> {
    const { data } = await $authHost.put('products', updateProductDto);
    return data;
  }
}
