export class CreateNotificationDto {
  readonly title?: string;
  readonly text?: string;
  readonly appId?: number;
  readonly notificationCategoryId?: number;
  readonly employeeIds?: number[];
}
