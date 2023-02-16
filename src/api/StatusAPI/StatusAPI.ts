import { $authHost } from 'api';
import { IStatusData } from 'models/api/IStatus';
import { GetStatusesDto } from './dto/get-statuses.dto';

export default class StatusAPI {
  static async getAll(
    getStatusesDto?: GetStatusesDto,
    signal?: AbortSignal
  ): Promise<IStatusData> {
    const { data } = await $authHost.get('statuses', {
      params: getStatusesDto,
      signal,
    });
    return data;
  }
}
