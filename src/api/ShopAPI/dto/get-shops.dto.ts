export class GetShopsDto {
  readonly limit?: number;
  readonly page?: number;
  readonly archive?: boolean;
  readonly isIncludeGeneral?: boolean;
  readonly search?: string;
}
