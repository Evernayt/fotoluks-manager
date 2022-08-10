import { IFeature } from './IFeature';

export interface IType {
  id: number;
  name: string;
  price: number;
  image: string;
  features: IFeature[] | null;
}
