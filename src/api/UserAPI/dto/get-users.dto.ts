export class GetUsersDto {
  readonly limit?: number;
  readonly page?: number;
  readonly archive?: boolean;
  readonly search?: string;
}
