import { UpdateTaskSubtaskDto } from 'api/TaskSubtaskAPI/dto/update-task-subtask.dto';
import { ITaskSubtask } from 'models/api/ITaskSubtask';

export class UpdateTaskDto {
  readonly id?: number;
  readonly title?: string;
  readonly description?: string;
  readonly urgent?: boolean;
  readonly personal?: boolean;
  readonly completed?: boolean;
  readonly completedDate?: string | null;
  readonly completionNote?: string;
  readonly archive?: boolean;
  readonly shopId?: number | null;
  readonly departmentId?: number | null;
  readonly executorId?: number | null;
  readonly taskMembersForCreate?: number[];
  readonly taskMembersForDelete?: number[];
  readonly taskSubtasksForCreate?: ITaskSubtask[];
  readonly taskSubtasksForUpdate?: UpdateTaskSubtaskDto[];
  readonly taskSubtasksForDelete?: number[];
}
