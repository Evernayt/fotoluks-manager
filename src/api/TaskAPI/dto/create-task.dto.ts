export class CreateTaskDto {
  readonly title?: string;
  readonly description?: string;
  readonly urgent?: boolean;
  readonly shopId?: number;
  readonly departmentId?: number;
  readonly creatorId?: number;
  readonly taskMembersForCreate?: number[];
}
