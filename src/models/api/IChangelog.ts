import { IData } from '../IData';

export interface IChangelog {
  id: number;
  version: string;
  description: string;
}

export type IChangelogData = IData<IChangelog[]>;
