import { $host, $authHost } from 'api';
import { CreateChangelogDto } from './dto/create-changelog.dto';
import { IChangelog, IChangelogData } from 'models/api/IChangelog';
import { GetChangelogsDto } from './dto/get-changelogs.dto';
import { UpdateChangelogDto } from './dto/update-changelog.dto';

export default class ChangelogAPI {
  static async create(
    createChangelogDto?: CreateChangelogDto
  ): Promise<IChangelog> {
    const { data } = await $authHost.post('changelogs', createChangelogDto);
    return data;
  }

  static async getAll(
    getChangelogsDto?: GetChangelogsDto,
    signal?: AbortSignal
  ): Promise<IChangelogData> {
    const { data } = await $host.get('changelogs', {
      params: getChangelogsDto,
      signal,
    });
    return data;
  }

  static async getOneByVersion(version: string): Promise<IChangelog> {
    const { data } = await $authHost.get(`changelogs/${version}`);
    return data;
  }

  static async update(
    updateChangelogDto?: UpdateChangelogDto
  ): Promise<IChangelog> {
    const { data } = await $authHost.put('changelogs', updateChangelogDto);
    return data;
  }
}
