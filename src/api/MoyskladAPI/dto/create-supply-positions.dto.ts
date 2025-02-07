import { IPosition } from 'models/api/moysklad/IPosition';

export class CreateSupplyPositionsDto {
  readonly id?: string;
  readonly positions?: IPosition[];
}
