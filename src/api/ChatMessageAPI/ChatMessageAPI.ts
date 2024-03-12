import { $authHost } from 'api';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { IChatMessage, IChatMessageData } from 'models/api/IChatMessage';
import { GetChatMessagesDto } from './dto/get-chat-messages.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';

export default class ChatMessageAPI {
  static async create(
    createChatMessageDto?: CreateChatMessageDto
  ): Promise<IChatMessage> {
    const { data } = await $authHost.post(
      'chat-messages',
      createChatMessageDto
    );
    return data;
  }

  static async getAll(
    getChatMessagesDto?: GetChatMessagesDto,
    signal?: AbortSignal
  ): Promise<IChatMessageData> {
    const { data } = await $authHost.get('chat-messages', {
      params: getChatMessagesDto,
      signal,
    });
    return data;
  }

  static async update(
    updateChatMessageDto?: UpdateChatMessageDto
  ): Promise<IChatMessage> {
    const { data } = await $authHost.put('chat-messages', updateChatMessageDto);
    return data;
  }

  static async delete(id: number): Promise<IChatMessage> {
    const { data } = await $authHost.delete(`chat-messages/${id}`);
    return data;
  }
}
