export class CreateTypeDto {
  readonly name?: string;
  readonly price?: number;
  readonly image?: string;
  readonly productId?: number;
  readonly featureIds?: number[];
}
