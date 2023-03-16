import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { ITask, ITaskData } from './../../models/api/ITask';
import { CreateTaskDto } from './dto/create-task.dto';
import { $authHost } from 'api';

export default class TaskAPI {
  static async create(createTaskDto?: CreateTaskDto): Promise<ITask> {
    const { data } = await $authHost.post('tasks', createTaskDto);
    return data;
  }

  static async getAll(
    getTasksDto?: GetTasksDto,
    signal?: AbortSignal
  ): Promise<ITaskData> {
    const { data } = await $authHost.get('tasks', {
      params: getTasksDto,
      signal,
    });
    return data;
  }

  static async getOne(id: number): Promise<ITask> {
    const { data } = await $authHost.get(`tasks/${id}`);
    return data;
  }

  static async update(updateTaskDto?: UpdateTaskDto): Promise<ITask> {
    const { data } = await $authHost.put('tasks', updateTaskDto);
    return data;
  }
}
