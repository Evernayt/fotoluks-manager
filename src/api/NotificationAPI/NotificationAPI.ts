import { $authHost } from 'api';
import { INotification, INotificationData } from 'models/api/INotification';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetNotificationsDto } from './dto/get-notifications.dto';

export default class NotificationAPI {
  static async create(
    createNotificationDto?: CreateNotificationDto
  ): Promise<INotification> {
    const { data } = await $authHost.post(
      'notifications',
      createNotificationDto
    );
    return data;
  }

  static async getAll(
    getNotificationsDto?: GetNotificationsDto
  ): Promise<INotificationData> {
    const { data } = await $authHost.get('notifications', {
      params: getNotificationsDto,
    });
    return data;
  }

  static async deleteByEmployeeId(employeeId: number): Promise<number> {
    const { data } = await $authHost.delete(`notifications/${employeeId}`);
    return data;
  }
}
