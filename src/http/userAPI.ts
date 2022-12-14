import { $authHost, $host } from './index';
import jwtDecode from 'jwt-decode';
import { IUser, IUserData, UserRoles } from 'models/IUser';
import { TOKEN_KEY } from 'constants/localStorage';

export const registrationAPI = async (user: IUser): Promise<IUser> => {
  const { data } = await $host.post('api/user/registration', {
    ...user,
    id: null,
  });
  localStorage.setItem(TOKEN_KEY, data.token);
  return jwtDecode(data.token);
};

interface ILogin {
  (login: string, password: string): Promise<IUser>;
}

export const loginAPI: ILogin = async (login, password) => {
  const { data } = await $host.post('api/user/login', { login, password });
  localStorage.setItem(TOKEN_KEY, data.token);
  return jwtDecode(data.token);
};

export const checkAPI = async (): Promise<IUser> => {
  const { data } = await $authHost.get('api/user/check');
  localStorage.setItem(TOKEN_KEY, data.token);
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
  const { data } = await $authHost.get(
    `api/user/search/?limit=${limit}&page=${page}&searchText=${searchText}`
  );
  return data;
};

export const fetchUserByPhoneAPI = async (phone: string): Promise<IUser> => {
  const { data } = await $authHost.get('api/user/oneByPhone/' + phone);
  return data;
};

export const updateUserAPI = async (user: IUser): Promise<IUser> => {
  const { data } = await $authHost.post('api/user/update', user);
  localStorage.setItem(TOKEN_KEY, data.token);
  return jwtDecode(data.token);
};

interface IFetchUsers {
  (
    limit: number,
    page: number,
    roles?: UserRoles[],
    shopId?: number,
    archive?: boolean
  ): Promise<IUserData>;
}

export const fetchUsersAPI: IFetchUsers = async (
  limit = 15,
  page = 1,
  roles,
  shopId,
  archive
) => {
  const { data } = await $authHost.post('api/user/all/', {
    limit,
    page,
    roles,
    shopId,
    archive,
  });
  return data;
};

interface IUpdateUserPassword {
  (userId: number, oldPassword: string, newPassword: string): Promise<IUser>;
}

export const updateUserPasswordAPI: IUpdateUserPassword = async (
  userId,
  oldPassword,
  newPassword
) => {
  const { data } = await $authHost.post('api/user/updatePassword', {
    userId,
    oldPassword,
    newPassword,
  });
  localStorage.setItem(TOKEN_KEY, data.token);
  return jwtDecode(data.token);
};

export const fetchUserAPI = async (id: number): Promise<IUser> => {
  const { data } = await $authHost.get('api/user/one/' + id);
  return data;
};
