export class GetOrdersDto {
  readonly limit?: number;
  readonly page?: number;
  readonly shopIds?: number[];
  readonly startDate?: string;
  readonly endDate?: string;
  readonly employeeId?: number;
  readonly statusId?: number;
  readonly search?: string;
}
