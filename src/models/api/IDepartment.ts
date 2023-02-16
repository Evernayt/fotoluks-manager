import { IData } from '../IData';

export interface IDepartment {
  id: number;
  name: string;
  archive: boolean;
}

export type IDepartmentData = IData<IDepartment[]>;
