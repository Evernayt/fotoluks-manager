export class CreateProductDto {
  readonly name?: string;
  readonly pluralName?: string;
  readonly description?: string;
  readonly image?: string;
  readonly categoryId?: number;
}
