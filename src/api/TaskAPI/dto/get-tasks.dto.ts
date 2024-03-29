export class GetTasksDto {
  readonly limit?: number;
  readonly page?: number;
  readonly archive?: boolean;
  readonly status?: number;
  readonly employeeId?: number;
  readonly creatorId?: number;
  readonly shopIds?: number[];
  readonly departmentIds?: number[];
  readonly search?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly urgent?: boolean;
  readonly personal?: boolean;
  readonly personalEmployeeId?: number;
}
