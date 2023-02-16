import { $authHost } from 'api';
import { IAppData } from 'models/api/IApp';
import { GetAppsDto } from './dto/get-apps.dto';

export default class AppAPI {
  static async getAll(getAppsDto?: GetAppsDto): Promise<IAppData> {
    const { data } = await $authHost.get('apps', {
      params: getAppsDto,
    });
    return data;
  }
}
