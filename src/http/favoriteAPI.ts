import { IFavorite } from 'models/IFavorite';
import { IFavoriteParam } from 'models/IFavoriteParam';
import { $authHost } from './index';

export const fetchFavoritesAPI = async (
  userId: number
): Promise<IFavorite[]> => {
  const { data } = await $authHost.get('api/favorite/all/' + userId);
  return data;
};

interface ICreateFavorite {
  (
    typeId: number,
    selectedParams: IFavoriteParam[],
    userId: number
  ): Promise<IFavorite>;
}

export const createFavoriteAPI: ICreateFavorite = async (
  typeId,
  selectedParams,
  userId
) => {
  const { data } = await $authHost.post('api/favorite/create', {
    typeId,
    selectedParams,
    userId,
  });
  return data;
};

export const deleteFavoriteAPI = async (id: number): Promise<number[]> => {
  const { data } = await $authHost.delete('api/favorite/delete/' + id);
  return data;
};
