export class GetDepartmentsDto {
  readonly limit?: number;
  readonly page?: number;
  readonly isIncludeGeneral?: boolean;
  readonly archive?: boolean;
}
