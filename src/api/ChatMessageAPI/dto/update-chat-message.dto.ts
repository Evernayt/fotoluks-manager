export class UpdateChatMessageDto {
  readonly id?: number;
  readonly message?: string;
  readonly type?: 'text' | 'image';
  readonly edited?: boolean;
}
