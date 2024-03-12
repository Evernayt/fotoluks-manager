export class CreateChatDto {
  readonly name?: string;
  readonly image?: string | null;
  readonly creatorId?: number;
  readonly employeeIds?: number[];
}
