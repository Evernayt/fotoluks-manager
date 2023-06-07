import { $authHost } from 'api';
import { GetRolesDto } from './dto/get-roles.dto';
import { IRoleData } from 'models/api/IRole';

export default class RoleAPI {
  static async getAll(
    getRolesDto?: GetRolesDto,
    signal?: AbortSignal
  ): Promise<IRoleData> {
    const { data } = await $authHost.get('roles', {
      params: getRolesDto,
      signal,
    });
    return data;
  }
}
