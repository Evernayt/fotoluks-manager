import { $authHost } from 'api';
import { IFeature, IFeatureData } from 'models/api/IFeature';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { GetFeaturesDto } from './dto/get-features.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';

export default class FeatureAPI {
  static async create(createFeatureDto?: CreateFeatureDto): Promise<IFeature> {
    const { data } = await $authHost.post('features', createFeatureDto);
    return data;
  }

  static async getAll(getFeaturesDto?: GetFeaturesDto): Promise<IFeatureData> {
    const { data } = await $authHost.get('features', {
      params: getFeaturesDto,
    });
    return data;
  }

  static async getOne(id: number): Promise<IFeature> {
    const { data } = await $authHost.get(`features/${id}`);
    return data;
  }

  static async update(updateFeatureDto?: UpdateFeatureDto): Promise<IFeature> {
    const { data } = await $authHost.put('features', updateFeatureDto);
    return data;
  }
}
