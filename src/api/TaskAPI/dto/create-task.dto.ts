import { ITaskSubtask } from 'models/api/ITaskSubtask';

export class CreateTaskDto {
  readonly title?: string;
  readonly description?: string;
  readonly urgent?: boolean;
  readonly personal?: boolean;
  readonly shopId?: number | null;
  readonly departmentId?: number | null;
  readonly creatorId?: number;
  readonly taskMembersForCreate?: number[];
  readonly taskSubtasksForCreate?: ITaskSubtask[];
}
