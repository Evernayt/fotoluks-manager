import { $authHost, $host } from './index';
import jwtDecode from 'jwt-decode';
import { IUser, IUserData, UserRoles } from 'models/IUser';

export const registrationAPI = async (user: IUser): Promise<IUser> => {
  const { data } = await $host.post('api/user/registration', {
    ...user,
    id: null,
  });
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};

interface ILogin {
  (login: string, password: string): Promise<IUser>;
}

export const loginAPI: ILogin = async (login, password) => {
  const { data } = await $host.post('api/user/login', { login, password });
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};

export const checkAPI = async (): Promise<IUser> => {
  const { data } = await $authHost.get('api/user/check');
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};

interface ISearchUsers {
  (limit: number, page: number, searchText: string): Promise<IUserData>;
}

export const searchUsersAPI: ISearchUsers = async (
  limit = 15,
  page = 1,
  searchText
) => {
  const { data } = await $host.get(
    `api/user/search/?limit=${limit}&page=${page}&searchText=${searchText}`
  );
  return data;
};

export const fetchUserAPI = async (phone: string): Promise<IUser> => {
  const { data } = await $host.get('api/user/one/' + phone);
  return data;
};

export const updateUserAPI = async (user: IUser): Promise<IUser> => {
  const { data } = await $host.post('api/user/update', user);
  return jwtDecode(data.token);
};

interface IFetchUsers {
  (limit: number, page: number, roles?: UserRoles[]): Promise<IUserData>;
}

export const fetchUsersAPI: IFetchUsers = async (
  limit = 15,
  page = 1,
  roles
) => {
  const { data } = await $host.post('api/user/all/', {
    limit,
    page,
    roles,
  });
  return data;
};
