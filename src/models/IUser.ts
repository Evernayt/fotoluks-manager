import { IFilter } from './IFilter';

export enum UserRoles {
  USER = 'USER',
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
}

export interface IUser {
  id: number;
  name: string;
  login: string;
  password?: string;
  avatar: string;
  role: UserRoles;
  phone: string;
  email: string;
  vk: string;
  telegram: string;
  shopId: number;
}

export interface IRole {
  id: number;
  name: string;
  role: UserRoles | null;
}

export interface IUserData {
  rows: IUser[];
  count: number;
}

export interface IUsersFilter {
  filter: IFilter;
  userRole: IRole;
}

export interface IFoundUsers {
  userData: IUserData;
  searchText: string;
}
