import { IStore } from 'models/api/moysklad/IStore';

export class EditMoveDto {
  readonly id?: string;
  readonly sourceStore?: IStore;
  readonly targetStore?: IStore;
  readonly description?: string;
}
