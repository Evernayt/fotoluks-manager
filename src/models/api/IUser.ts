import { GetUsersDto } from 'api/UserAPI/dto/get-users.dto';
import { IFilter } from 'models/IFilter';
import { IData } from '../IData';

export interface IUser {
  id: number;
  name: string;
  phone: string;
  email: string;
  vk: string;
  telegram: string;
  archive: boolean;
  avatar?: string;
  password?: string;
}

export type IUserData = IData<IUser[]>;

export interface IUsersFilter extends Partial<IFilter>, GetUsersDto {}
