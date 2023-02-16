import { IPosition } from 'models/api/moysklad/IPosition';

export class CreateLossPositionsDto {
  readonly id?: string;
  readonly positions?: IPosition[];
}
