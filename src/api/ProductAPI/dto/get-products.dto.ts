export class GetProductsDto {
  readonly limit?: number;
  readonly page?: number;
  readonly archive?: boolean;
  readonly search?: string;
}
