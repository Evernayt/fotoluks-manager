import { $host } from 'api';
import { UpsertChatReadMessageDto } from './dto/upsert-chat-read-message.dto';
import { IChatReadMessage } from 'models/api/IChatReadMessage';

export default class ChatReadMessageAPI {
  static async upsert(
    upsertChatReadMessageDto?: UpsertChatReadMessageDto
  ): Promise<IChatReadMessage> {
    const { data } = await $host.post(
      'chat-read-messages',
      upsertChatReadMessageDto
    );
    return data;
  }
}
