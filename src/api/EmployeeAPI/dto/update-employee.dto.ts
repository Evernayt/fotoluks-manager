export class UpdateEmployeeDto {
  readonly id?: number;
  readonly name?: string;
  readonly login?: string;
  readonly avatar?: string;
  readonly roleId?: number;
  readonly archive?: boolean;
}
