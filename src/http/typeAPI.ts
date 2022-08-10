import { IType } from 'models/IType';
import { $host } from './index';

interface IFetchTypes {
  (productId: number): Promise<IType[]>;
}

export const fetchTypesAPI: IFetchTypes = async (productId) => {
  const { data } = await $host.get('api/type/all/' + productId);
  return data;
};
