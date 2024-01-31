import { $host, $authHost } from 'api';
import { CreateReportDto } from './dto/create-report.dto';
import { IReport, IReportData } from 'models/api/IReport';
import { GetReportsDto } from './dto/get-reports.dto';
import { UpdateReportDto } from './dto/update-report.dto';

export default class ReportAPI {
  static async create(createReportDto?: CreateReportDto): Promise<IReport> {
    const { data } = await $authHost.post('reports', createReportDto);
    return data;
  }

  static async getAll(
    getReportsDto?: GetReportsDto,
    signal?: AbortSignal
  ): Promise<IReportData> {
    const { data } = await $host.get('reports', {
      params: getReportsDto,
      signal,
    });
    return data;
  }

  static async update(updateReportDto?: UpdateReportDto): Promise<IReport> {
    const { data } = await $authHost.put('reports', updateReportDto);
    return data;
  }
}
