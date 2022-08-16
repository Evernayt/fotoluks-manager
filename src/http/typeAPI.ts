import { IType, ITypeData } from 'models/IType';
import { $host } from './index';

interface IFetchTypesByProductId {
  (productId: number): Promise<IType[]>;
}

export const fetchTypesByProductIdAPI: IFetchTypesByProductId = async (
  productId
) => {
  const { data } = await $host.get('api/type/all/' + productId);
  return data;
};

interface IFetchTypes {
  (limit?: number, page?: number): Promise<ITypeData>;
}

export const fetchTypesAPI: IFetchTypes = async (limit = 100, page = 1) => {
  const { data } = await $host.get(`api/type/all/?limit=${limit}&page=${page}`);
  return data;
};

interface IFetchType {
  (typeId: number): Promise<IType>;
}

export const fetchTypeAPI: IFetchType = async (typeId) => {
  const { data } = await $host.get('api/type/one/' + typeId);
  return data;
};

interface IUpdateType {
  (
    id: number,
    name: string,
    image: string,
    price: number,
    productId: number
  ): Promise<IType>;
}

export const updateTypeAPI: IUpdateType = async (
  id,
  name,
  image,
  price,
  productId
) => {
  const { data } = await $host.post('api/type/update', {
    id,
    name,
    image,
    price,
    productId,
  });
  return data;
};
