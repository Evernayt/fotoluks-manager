import { IParam, IParamData } from 'models/IParam';
import { $authHost } from './index';

export const fetchParamsByFeatureIdAPI = async (
  featureId: number
): Promise<IParam[]> => {
  const { data } = await $authHost.get('api/param/all/' + featureId);
  return data;
};

interface IFetchParams {
  (limit?: number, page?: number, archive?: boolean): Promise<IParamData>;
}

export const fetchParamsAPI: IFetchParams = async (
  limit = 100,
  page = 1,
  archive
) => {
  const { data } = await $authHost.post('api/param/all', {
    limit,
    page,
    archive,
  });
  return data;
};

interface ISearchParams {
  (limit: number, page: number, searchText: string): Promise<IParamData>;
}

export const searchParamsAPI: ISearchParams = async (
  limit = 15,
  page = 1,
  searchText
) => {
  const { data } = await $authHost.get(
    `api/param/search/?limit=${limit}&page=${page}&searchText=${searchText}`
  );
  return data;
};

export const updateParamAPI = async (param: IParam): Promise<IParam> => {
  const { data } = await $authHost.post('api/param/update', param);
  return data;
};

interface IFetchParam {
  (paramId: number): Promise<IParam>;
}

export const fetchParamAPI: IFetchParam = async (paramId) => {
  const { data } = await $authHost.get('api/param/one/' + paramId);
  return data;
};

interface ICreateParam {
  (name: string, value: string, featureId: number): Promise<IParam>;
}

export const createParamAPI: ICreateParam = async (name, value, featureId) => {
  const { data } = await $authHost.post('api/param/create', {
    name,
    value,
    featureId,
  });
  return data;
};
