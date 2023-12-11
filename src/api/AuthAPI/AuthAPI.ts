import { $authHost, $host } from 'api';
import { CreateEmployeeDto } from 'api/EmployeeAPI/dto/create-employee.dto';
import jwtDecode from 'jwt-decode';
import { IEmployee } from 'models/api/IEmployee';
import { CreateUserDto } from 'api/UserAPI/dto/create-user.dto';
import { IUser } from 'models/api/IUser';
import { setToken } from 'helpers/localStorage';

export default class AuthAPI {
  static async login(
    createEmployeeDto: CreateEmployeeDto,
    signal?: AbortSignal
  ): Promise<IEmployee> {
    const { data } = await $host.post(
      'auth/login/employee',
      createEmployeeDto,
      { signal }
    );
    setToken(data.token);
    return jwtDecode(data.token);
  }

  static async registration(
    createEmployeeDto: CreateEmployeeDto
  ): Promise<IEmployee> {
    const { data } = await $authHost.post(
      'auth/registration/employee',
      createEmployeeDto
    );
    return jwtDecode(data.token);
  }

  static async registrationUser(createUserDto: CreateUserDto): Promise<IUser> {
    const { data } = await $host.post('auth/registration', createUserDto);
    return jwtDecode(data.token);
  }

  static async checkAuth(login: string): Promise<IEmployee> {
    const { data } = await $authHost.get('auth/check/employee/' + login);
    setToken(data.token);
    return jwtDecode(data.token);
  }
}
