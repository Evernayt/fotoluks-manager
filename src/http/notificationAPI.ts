import { INotificationData } from 'models/INotification';
import { $host } from './index';

interface IFetchNotifications {
  (limit: number, page: number, userId: number): Promise<INotificationData>;
}

export const fetchNotificationsAPI: IFetchNotifications = async (
  limit = 25,
  page = 1,
  userId
) => {
  const { data } = await $host.get(
    `api/notification/all/?limit=${limit}&page=${page}&userId=${userId}`
  );
  return data;
};

export const deleteAllNotificationsAPI = async (
  userId: number
): Promise<{ message: string }> => {
  const { data } = await $host.delete('api/notification/deleteAll/' + userId);
  return data;
};
