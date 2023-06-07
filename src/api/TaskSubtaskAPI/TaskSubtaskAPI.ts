import { $authHost } from 'api';
import { ITaskSubtask } from 'models/api/ITaskSubtask';
import { UpdateTaskSubtaskDto } from './dto/update-task-subtask.dto';

export default class TaskSubtaskAPI {
  static async update(
    updateTaskSubtaskDto?: UpdateTaskSubtaskDto
  ): Promise<ITaskSubtask> {
    const { data } = await $authHost.put('task-subtasks', updateTaskSubtaskDto);
    return data;
  }
}
