import { IEmployee } from './api/IEmployee';

export interface IEditor {
  targetId: number | string;
  employee: IEmployee;
  socketId?: string;
}
