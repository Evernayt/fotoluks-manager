import { IEmployee } from './IEmployee';

export interface IChatMember {
  id: number | string;
  chatId: number;
  employeeId: number;
  employee: IEmployee;
}
