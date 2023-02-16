import { $authHost } from 'api';
import { IFavorite, IFavoriteData } from 'models/api/IFavorite';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { GetFavoritesDto } from './dto/get-favorites.dto';

export default class FavoriteAPI {
  static async create(
    createFavoriteDto?: CreateFavoriteDto
  ): Promise<IFavorite> {
    const { data } = await $authHost.post('favorites', createFavoriteDto);
    return data;
  }

  static async getAll(
    getFavoritesDto?: GetFavoritesDto
  ): Promise<IFavoriteData> {
    const { data } = await $authHost.get('favorites', {
      params: getFavoritesDto,
    });
    return data;
  }

  static async delete(id: number): Promise<number> {
    const { data } = await $authHost.delete(`favorites/${id}`);
    return data;
  }
}
