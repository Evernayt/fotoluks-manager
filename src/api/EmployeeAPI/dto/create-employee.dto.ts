export class CreateEmployeeDto {
  readonly name?: string;
  readonly surname?: string;
  readonly login?: string;
  readonly password?: string;
  readonly avatar?: string | null;
  readonly roleId?: number;
}
