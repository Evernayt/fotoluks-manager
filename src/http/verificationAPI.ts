import { IUser } from 'models/IUser';
import { $host } from './index';

interface IVerifiedData {
  phoneVerified: boolean;
  user: IUser;
}

export const isVerifiedAPI = async (phone: string): Promise<IVerifiedData> => {
  const { data } = await $host.get('api/verification/isVerified/' + phone);
  return data;
};
