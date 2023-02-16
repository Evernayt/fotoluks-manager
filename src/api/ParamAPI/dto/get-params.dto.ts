export class GetParamsDto {
  readonly limit?: number;
  readonly page?: number;
  readonly archive?: boolean;
  readonly search?: string;
  readonly featureId?: number;
}
