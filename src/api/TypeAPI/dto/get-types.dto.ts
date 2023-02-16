export class GetTypesDto {
  readonly limit?: number;
  readonly page?: number;
  readonly archive?: boolean;
  readonly productId?: number;
  readonly search?: string;
}
