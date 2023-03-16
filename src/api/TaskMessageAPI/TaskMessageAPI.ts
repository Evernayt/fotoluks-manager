import { $authHost } from 'api';
import { ITaskMessage, ITaskMessageData } from 'models/api/ITaskMessage';
import { CreateTaskMessageDto } from './dto/create-task-message.dto';
import { GetTaskMessagesDto } from './dto/get-task-messages.dto';

export default class TaskMessageAPI {
  static async create(
    createTaskMessageDto?: CreateTaskMessageDto
  ): Promise<ITaskMessage> {
    const { data } = await $authHost.post(
      'task-messages',
      createTaskMessageDto
    );
    return data;
  }

  static async getAll(
    getTaskMessagesDto?: GetTaskMessagesDto,
    signal?: AbortSignal
  ): Promise<ITaskMessageData> {
    const { data } = await $authHost.get('task-messages', {
      params: getTaskMessagesDto,
      signal,
    });
    return data;
  }
}
