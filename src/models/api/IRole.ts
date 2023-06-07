import { IData } from 'models/IData';

export interface IRole {
  id: number;
  name: string;
  accessLevel: number;
}

export type IRoleData = IData<IRole[]>;
