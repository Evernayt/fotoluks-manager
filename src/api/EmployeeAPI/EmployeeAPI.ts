import { $authHost } from 'api';
import { IEmployee, IEmployeeData } from 'models/api/IEmployee';
import { AddAppDto } from './dto/add-app.dto';
import { AddDepartmentDto } from './dto/add-department.dto';
import { GetEmployeesDto } from './dto/get-employees.dto';
import { UpdateEmployeePasswordDto } from './dto/update-employee-password.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

export default class EmployeeAPI {
  static async getAll(
    getEmployeesDto?: GetEmployeesDto,
    signal?: AbortSignal
  ): Promise<IEmployeeData> {
    const { data } = await $authHost.get('employees', {
      params: getEmployeesDto,
      signal,
    });
    return data;
  }

  static async getOne(id: number): Promise<IEmployee> {
    const { data } = await $authHost.get(`employees/${id}`);
    return data;
  }

  static async update(
    updateEmployeeDto?: UpdateEmployeeDto
  ): Promise<IEmployee> {
    const { data } = await $authHost.put('employees', updateEmployeeDto);
    return data;
  }

  static async updatePassword(
    updateEmployeePasswordDto?: UpdateEmployeePasswordDto
  ): Promise<IEmployee> {
    const { data } = await $authHost.put(
      'employees/password',
      updateEmployeePasswordDto
    );
    return data;
  }

  static async addApp(addAppDto?: AddAppDto) {
    const { data } = await $authHost.post('employees/app', addAppDto);
    return data;
  }

  static async addDepartment(addDepartmentDto?: AddDepartmentDto) {
    const { data } = await $authHost.post(
      'employees/department',
      addDepartmentDto
    );
    return data;
  }
}
