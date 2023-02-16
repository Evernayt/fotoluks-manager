export class UpdateProductDto {
  readonly id?: number;
  readonly name?: string;
  readonly pluralName?: string;
  readonly description?: string;
  readonly image?: string;
  readonly categoryId?: number;
  readonly archive?: boolean;
}
