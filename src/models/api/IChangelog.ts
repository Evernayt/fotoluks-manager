import { IData } from '../IData';

export interface IChangelog {
  id: number;
  version: string;
  description: string;
  createdAt: string;
}

export type IChangelogData = IData<IChangelog[]>;
