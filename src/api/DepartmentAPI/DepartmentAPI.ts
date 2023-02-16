import { $authHost } from 'api';
import { IDepartmentData } from 'models/api/IDepartment';
import { GetDepartmentsDto } from './dto/get-departments.dto';

export default class DepartmentAPI {
  static async getAll(
    getDepartmentsDto?: GetDepartmentsDto,
    signal?: AbortSignal
  ): Promise<IDepartmentData> {
    const { data } = await $authHost.get('departments', {
      params: getDepartmentsDto,
      signal,
    });
    return data;
  }
}
