export class UpdateTypeDto {
  readonly id?: number;
  readonly name?: string;
  readonly price?: number;
  readonly image?: string;
  readonly productId?: number;
  readonly featureIds?: number[];
  readonly archive?: boolean;
}
