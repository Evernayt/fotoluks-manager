import { IEmployee } from './IEmployee';

export interface IOrderMember {
  id: number | string;
  employee: IEmployee;
}
