import { $authHost } from 'api';
import { IParam } from 'models/api/IParam';
import { IType, ITypeData } from 'models/api/IType';
import { CreateTypeDto } from './dto/create-type.dto';
import { GetTypeParamsDto } from './dto/get-type-params.dto';
import { GetTypesDto } from './dto/get-types.dto';
import { UpdateTypeParamsDto } from './dto/update-type-params.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

export default class TypeAPI {
  static async create(createTypeDto?: CreateTypeDto): Promise<IType> {
    const { data } = await $authHost.post('types', createTypeDto);
    return data;
  }

  static async getAll(getTypesDto?: GetTypesDto): Promise<ITypeData> {
    const { data } = await $authHost.get('types', { params: getTypesDto });
    return data;
  }

  static async getOne(id: number): Promise<IType> {
    const { data } = await $authHost.get(`types/${id}`);
    return data;
  }

  static async getParams(
    getTypeParamsDto: GetTypeParamsDto
  ): Promise<IParam[]> {
    const { data } = await $authHost.get('types/params', {
      params: getTypeParamsDto,
    });
    return data;
  }

  static async update(updateTypeDto?: UpdateTypeDto): Promise<IType> {
    const { data } = await $authHost.put('types', updateTypeDto);
    return data;
  }

  static async updateParams(
    updateTypeParamsDto?: UpdateTypeParamsDto
  ): Promise<number[]> {
    const { data } = await $authHost.put('types/params', updateTypeParamsDto);
    return data;
  }
}
