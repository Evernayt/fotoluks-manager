import { $authHost } from 'api';
import { IUser, IUserData } from 'models/api/IUser';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export default class UserAPI {
  static async getAll(getUsersDto?: GetUsersDto): Promise<IUserData> {
    const { data } = await $authHost.get('users', { params: getUsersDto });
    return data;
  }

  static async getOneByPhone(phone: string): Promise<IUser> {
    const { data } = await $authHost.get(`users/phone/${phone}`);
    return data;
  }

  static async getOne(id: number): Promise<IUser> {
    const { data } = await $authHost.get(`users/${id}`);
    return data;
  }

  static async update(updateUserDto?: UpdateUserDto): Promise<IUser> {
    const { data } = await $authHost.put('users', updateUserDto);
    return data;
  }
}
