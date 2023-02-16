import { $authHost } from 'api';
import { IParam, IParamData } from 'models/api/IParam';
import { CreateParamDto } from './dto/create-param.dto';
import { GetParamsDto } from './dto/get-params.dto';
import { UpdateParamDto } from './dto/update-param.dto';

export default class ParamAPI {
  static async create(createParamDto?: CreateParamDto): Promise<IParam> {
    const { data } = await $authHost.post('params', createParamDto);
    return data;
  }

  static async getAll(getParamsDto?: GetParamsDto): Promise<IParamData> {
    const { data } = await $authHost.get('params', {
      params: getParamsDto,
    });
    return data;
  }

  static async getOne(id: number): Promise<IParam> {
    const { data } = await $authHost.get(`params/${id}`);
    return data;
  }

  static async update(updateParamDto?: UpdateParamDto): Promise<IParam> {
    const { data } = await $authHost.put('params', updateParamDto);
    return data;
  }
}
