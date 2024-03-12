import { $authHost } from 'api';
import { CreateChatDto } from './dto/create-chat.dto';
import { IChat, IChatData } from 'models/api/IChat';
import { GetChatsDto } from './dto/get-chats.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { LeaveChatDto } from './dto/leave-chat.dto';

export default class ChatAPI {
  static async create(createChatDto?: CreateChatDto): Promise<IChat> {
    const { data } = await $authHost.post('chats', createChatDto);
    return data;
  }

  static async getAll(
    getChatsDto?: GetChatsDto,
    signal?: AbortSignal
  ): Promise<IChatData> {
    const { data } = await $authHost.get('chats', {
      params: getChatsDto,
      signal,
    });
    return data;
  }

  static async getOne(id: number): Promise<IChat> {
    const { data } = await $authHost.get(`chats/${id}`);
    return data;
  }

  static async update(updateChatDto?: UpdateChatDto): Promise<IChat> {
    const { data } = await $authHost.put('chats', updateChatDto);
    return data;
  }

  static async leave(leaveChatDto?: LeaveChatDto): Promise<IChat> {
    const { data } = await $authHost.put('chats/leave', leaveChatDto);
    return data;
  }

  static async delete(id: number): Promise<IChat> {
    const { data } = await $authHost.delete(`chats/${id}`);
    return data;
  }
}
