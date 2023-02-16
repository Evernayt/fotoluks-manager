import { $authHost } from 'api';
import { ICategory, ICategoryData } from 'models/api/ICategory';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

export default class CategoryAPI {
  static async create(
    createCategoryDto?: CreateCategoryDto
  ): Promise<ICategory> {
    const { data } = await $authHost.post('categories', createCategoryDto);
    return data;
  }

  static async getAll(
    getCategoriesDto?: GetCategoriesDto
  ): Promise<ICategoryData> {
    const { data } = await $authHost.get('categories', {
      params: getCategoriesDto,
    });
    return data;
  }

  static async getOne(id: number): Promise<ICategory> {
    const { data } = await $authHost.get(`categories/${id}`);
    return data;
  }

  static async update(
    updateCategoryDto?: UpdateCategoryDto
  ): Promise<ICategory> {
    const { data } = await $authHost.put('products', updateCategoryDto);
    return data;
  }
}
