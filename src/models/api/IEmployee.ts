import { GetEmployeesDto } from 'api/EmployeeAPI/dto/get-employees.dto';
import { IData } from 'models/IData';
import { IFilter } from 'models/IFilter';
import { IApp } from './IApp';
import { IDepartment } from './IDepartment';
import { IRole } from './IRole';

export interface IEmployee {
  id: number;
  name: string;
  surname: string;
  login: string;
  password: string;
  archive: boolean;
  avatar: string | null;
  apps?: IApp[];
  departments?: IDepartment[];
  role?: IRole;
}

export type IEmployeeData = IData<IEmployee[]>;

export interface IEmployeesFilter extends Partial<IFilter>, GetEmployeesDto {}
