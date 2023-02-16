import { ISelectedParam } from 'models/api/ISelectedParam';

export class CreateFavoriteDto {
  readonly employeeId?: number;
  readonly typeId?: number;
  readonly selectedParams?: ISelectedParam[];
}
