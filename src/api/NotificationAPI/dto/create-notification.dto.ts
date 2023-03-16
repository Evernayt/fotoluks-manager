export class CreateNotificationDto {
  readonly title?: string;
  readonly text?: string;
  readonly appId?: number;
  readonly employeeIds?: number[];
}
