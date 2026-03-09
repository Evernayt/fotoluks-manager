export class GetRetailshiftsDto {
  readonly limit?: number;
  readonly offset?: number;
  readonly search?: string;
  readonly momentPeriod?: [string, string];
}
