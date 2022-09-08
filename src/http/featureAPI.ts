import { IFeature, IFeatureData } from 'models/IFeature';
import { $authHost } from './index';

interface IFetchFeatures {
  (limit?: number, page?: number, archive?: boolean): Promise<IFeatureData>;
}

export const fetchFeaturesAPI: IFetchFeatures = async (
  limit = 100,
  page = 1,
  archive
) => {
  const { data } = await $authHost.post('api/feature/all', {
    limit,
    page,
    archive,
  });
  return data;
};

interface ISearchFeatures {
  (limit: number, page: number, searchText: string): Promise<IFeatureData>;
}

export const searchFeaturesAPI: ISearchFeatures = async (
  limit = 15,
  page = 1,
  searchText
) => {
  const { data } = await $authHost.get(
    `api/feature/search/?limit=${limit}&page=${page}&searchText=${searchText}`
  );
  return data;
};

export const updateFeatureAPI = async (
  feature: IFeature
): Promise<IFeature> => {
  const { data } = await $authHost.post('api/feature/update', feature);
  return data;
};

interface IFetchFeature {
  (featureId: number): Promise<IFeature>;
}

export const fetchFeatureAPI: IFetchFeature = async (featureId) => {
  const { data } = await $authHost.get('api/feature/one/' + featureId);
  return data;
};

interface ICreateFeature {
  (name: string, pluralName: string): Promise<IFeature>;
}

export const createFeatureAPI: ICreateFeature = async (name, pluralName) => {
  const { data } = await $authHost.post('api/feature/create', {
    name,
    pluralName,
  });
  return data;
};
