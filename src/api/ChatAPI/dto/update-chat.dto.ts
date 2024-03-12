export class UpdateChatDto {
  readonly id?: number;
  readonly name?: string;
  readonly image?: string | null;
  readonly creatorId?: number;
  readonly employeeIds?: number[];
}
