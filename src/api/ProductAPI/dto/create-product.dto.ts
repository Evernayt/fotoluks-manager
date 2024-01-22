export class CreateProductDto {
  readonly name?: string;
  readonly moyskladId?: string | null;
  readonly price?: number;
  readonly discountProhibited?: boolean;
  readonly moyskladSynchronizedAt?: string | null;
  readonly image?: string | null;
}
