import { IAttribute } from 'models/api/moysklad/IAttribute';
import { ICounterparty } from 'models/api/moysklad/ICounterparty';
import { IPosition } from 'models/api/moysklad/IPosition';
import { IStore } from 'models/api/moysklad/IStore';

export class EditSupplyDto {
  readonly id?: string;
  readonly agent?: ICounterparty;
  readonly store?: IStore;
  readonly incomingNumber?: string;
  readonly incomingDate?: string;
  readonly description?: string;
  readonly attributes?: IAttribute[];
  readonly positions?: IPosition[];
}
