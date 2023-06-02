export class UpdateTaskDto {
  readonly id?: number;
  readonly name?: string;
  readonly title?: string;
  readonly description?: string;
  readonly urgent?: boolean;
  readonly completed?: boolean;
  readonly completedDate?: string | null;
  readonly completionNote?: string;
  readonly archive?: boolean;
  readonly shopId?: number;
  readonly departmentId?: number;
  readonly executorId?: number | null;
  readonly taskMembersForCreate?: number[];
  readonly taskMembersForDelete?: number[];
}
