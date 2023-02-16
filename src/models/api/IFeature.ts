import { GetFeaturesDto } from 'api/FeatureAPI/dto/get-features.dto';
import { IData } from 'models/IData';
import { IFilter } from 'models/IFilter';

export interface IFeature {
  id: number;
  name: string;
  pluralName: string;
  archive: boolean;
}

export type IFeatureData = IData<IFeature[]>;

export interface IFeaturesFilter extends Partial<IFilter>, GetFeaturesDto {}
