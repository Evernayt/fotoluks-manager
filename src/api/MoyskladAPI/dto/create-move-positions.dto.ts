import { IPosition } from 'models/api/moysklad/IPosition';

export class CreateMovePositionsDto {
  readonly id?: string;
  readonly positions?: IPosition[];
}
