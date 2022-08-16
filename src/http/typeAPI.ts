import { IParam } from 'models/IParam';
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
    featureIds: number[]
  ): Promise<number[]>;
}

export const updateTypeAPI: IUpdateType = async (
  id,
  name,
  image,
  price,
  featureIds
) => {
  const { data } = await $host.post('api/type/update', {
    id,
    name,
    image,
    price,
    featureIds,
  });
  return data;
};

interface ICreateType {
  (
    name: string,
    image: string,
    price: number,
    productId: number,
    featureIds: number[]
  ): Promise<IType>;
}

export const createTypeAPI: ICreateType = async (
  name,
  image,
  price,
  productId,
  featureIds
) => {
  const { data } = await $host.post('api/type/create', {
    name,
    image,
    price,
    productId,
    featureIds,
  });
  return data;
};

interface IFetchTypeParams {
  (typeId: number, featureId: number): Promise<IParam[]>;
}

export const fetchTypeParamsAPI: IFetchTypeParams = async (
  typeId,
  featureId
) => {
  const { data } = await $host.get(
    `api/type/params/?typeId=${typeId}&featureId=${featureId}`
  );
  return data;
};

interface IUpdateTypeParams {
  (id: number, paramIds: number[]): Promise<number[]>;
}

export const updateTypeParamsAPI: IUpdateTypeParams = async (id, paramIds) => {
  const { data } = await $host.post('api/type/updateParams', {
    id,
    paramIds,
  });
  return data;
};
