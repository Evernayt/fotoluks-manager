import { ISalePrice } from 'models/api/moysklad/ISalePrice';

export class UpdateProductDto {
  readonly id?: string;
  readonly article?: string;
  readonly code?: string;
  readonly description?: string;
  readonly minimumBalance?: number;
  readonly salePrices?: ISalePrice[];
}
