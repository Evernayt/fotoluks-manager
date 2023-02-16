import { GetParamsDto } from 'api/ParamAPI/dto/get-params.dto';
import { IData } from 'models/IData';
import { IFilter } from 'models/IFilter';
import { IFeature } from './IFeature';

export interface IParam {
  id: number;
  value: string;
  name: string;
  archive: boolean;
  feature?: IFeature;
  featureId?: number;
}

export type IParamData = IData<IParam[]>;

export interface IParamsFilter extends Partial<IFilter>, GetParamsDto {}
