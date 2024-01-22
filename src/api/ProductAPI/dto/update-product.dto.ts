export class UpdateProductDto {
  readonly id?: number;
  readonly name?: string;
  readonly moyskladId?: string | null;
  readonly price?: number;
  readonly discountProhibited?: boolean;
  readonly moyskladSynchronizedAt?: string | null;
  readonly image?: string | null;
  readonly archive?: boolean;
}
