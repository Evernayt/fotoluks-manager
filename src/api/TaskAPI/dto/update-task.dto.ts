export class UpdateTaskDto {
  readonly id?: number;
  readonly title?: string;
  readonly description?: string;
  readonly urgent?: boolean;
  readonly completed?: boolean;
  readonly completedDate?: string | null;
  readonly archive?: boolean;
  readonly shopId?: number;
  readonly departmentId?: number;
  readonly executorId?: number | null;
  readonly taskMembersForCreate?: number[];
  readonly taskMembersForDelete?: number[];
}
