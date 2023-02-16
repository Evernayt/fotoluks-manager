import { IPosition } from 'models/api/moysklad/IPosition';
import { IStore } from 'models/api/moysklad/IStore';

export class CreateLossDto {
  readonly store?: IStore;
  readonly positions?: IPosition[];
  readonly updated?: string;
  readonly description?: string;
}
