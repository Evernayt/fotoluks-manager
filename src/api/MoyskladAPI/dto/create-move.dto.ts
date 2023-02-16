import { IStore } from 'models/api/moysklad/IStore';

export class CreateMoveDto {
  readonly sourceStore?: IStore;
  readonly targetStore?: IStore;
  readonly description?: string;
}
