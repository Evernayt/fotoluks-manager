import { GetEmployeesDto } from 'api/EmployeeAPI/dto/get-employees.dto';
import { IData } from 'models/IData';
import { IFilter } from 'models/IFilter';
import { IApp } from './IApp';
import { IDepartment } from './IDepartment';

export interface IEmployee {
  id: number;
  name: string;
  login: string;
  archive: boolean;
  avatar?: string;
  apps?: IApp[];
  departments?: IDepartment[];
}

export type IEmployeeData = IData<IEmployee[]>;

export interface IEmployeesFilter extends Partial<IFilter>, GetEmployeesDto {}
