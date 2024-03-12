export class CreateChatMessageDto {
  readonly message?: string;
  readonly type?: 'text' | 'image';
  readonly chatId?: number;
  readonly employeeId?: number;
}
