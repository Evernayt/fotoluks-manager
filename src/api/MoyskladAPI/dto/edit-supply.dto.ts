import { IPosition } from 'models/api/moysklad/IPosition';

export class EditSupplyDto {
  readonly id?: string;
  readonly positions?: IPosition[];
}
