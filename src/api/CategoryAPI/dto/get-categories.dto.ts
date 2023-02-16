export class GetCategoriesDto {
  readonly limit?: number;
  readonly page?: number;
  readonly archive?: boolean;
  readonly search?: string;
}
