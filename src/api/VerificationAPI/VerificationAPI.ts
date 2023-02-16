import { $host } from 'api';
import { IUser } from 'models/api/IUser';

export default class VerificationAPI {
  static async isVerified(
    phone: string
  ): Promise<{ phoneVerified: boolean; user: IUser }> {
    const { data } = await $host.get(`verification/isVerified/${phone}`);
    return data;
  }
}
