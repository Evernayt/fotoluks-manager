export class UpdateEmployeeDto {
  readonly id?: number;
  readonly name?: string;
  readonly surname?: string;
  readonly login?: string;
  readonly avatar?: string | null;
  readonly roleId?: number;
  readonly archive?: boolean;
}
