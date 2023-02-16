import { $authHost } from 'api';
import { IOrderInfoData, IOrderInfoStatisticData } from 'models/api/IOrderInfo';
import { GetOrderInfosDto } from './dto/get-order-infos.dto';
import { GetStatisticsDto } from './dto/get-statistics.dto';

export default class OrderInfoAPI {
  static async getAll(
    getOrderInfosDto: GetOrderInfosDto,
    signal?: AbortSignal
  ): Promise<IOrderInfoData> {
    const { data } = await $authHost.get('order-infos', {
      params: getOrderInfosDto,
      signal,
    });
    return data;
  }

  static async getStatistics(
    getStatisticsDto: GetStatisticsDto,
    signal?: AbortSignal
  ): Promise<IOrderInfoStatisticData> {
    const { data } = await $authHost.get('order-infos/statistics', {
      params: getStatisticsDto,
      signal,
    });
    return data;
  }
}
