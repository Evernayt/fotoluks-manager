export class GetEmployeesDto {
  readonly limit?: number;
  readonly page?: number;
  readonly archive?: boolean;
  readonly search?: string;
  readonly appId?: number;
}
