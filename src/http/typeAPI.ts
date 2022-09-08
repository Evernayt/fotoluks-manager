import { IParam } from 'models/IParam';
import { IType, ITypeData } from 'models/IType';
import { $host, $authHost } from './index';

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
  (limit?: number, page?: number, archive?: boolean): Promise<ITypeData>;
}

export const fetchTypesAPI: IFetchTypes = async (
  limit = 100,
  page = 1,
  archive
) => {
  const { data } = await $authHost.post('api/type/all', {
    limit,
    page,
    archive,
  });
  return data;
};

interface IFetchType {
  (typeId: number): Promise<IType>;
}

export const fetchTypeAPI: IFetchType = async (typeId) => {
  const { data } = await $authHost.get('api/type/one/' + typeId);
  return data;
};

interface IUpdateType {
  (type: IType, featureIds: number[]): Promise<number[]>;
}

export const updateTypeAPI: IUpdateType = async (type, featureIds) => {
  const { data } = await $authHost.post('api/type/update', {
    type,
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
  const { data } = await $authHost.post('api/type/create', {
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
  const { data } = await $authHost.get(
    `api/type/params/?typeId=${typeId}&featureId=${featureId}`
  );
  return data;
};

interface IUpdateTypeParams {
  (
    id: number,
    paramIdsForCreate: number[],
    paramIdsForDelete: number[]
  ): Promise<number[]>;
}

export const updateTypeParamsAPI: IUpdateTypeParams = async (
  id,
  paramIdsForCreate,
  paramIdsForDelete
) => {
  const { data } = await $authHost.post('api/type/updateParams', {
    id,
    paramIdsForCreate,
    paramIdsForDelete,
  });
  return data;
};

interface ISearchTypes {
  (limit: number, page: number, searchText: string): Promise<ITypeData>;
}

export const searchTypesAPI: ISearchTypes = async (
  limit = 15,
  page = 1,
  searchText
) => {
  const { data } = await $authHost.get(
    `api/type/search/?limit=${limit}&page=${page}&searchText=${searchText}`
  );
  return data;
};
