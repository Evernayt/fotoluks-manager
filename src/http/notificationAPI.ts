import { INotification, INotificationData } from 'models/INotification';
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

interface ICreateNotification {
  (title: string, text: string, userIds: number[]): Promise<INotification>;
}

export const createNotificationAPI: ICreateNotification = async (
  title,
  text,
  userIds
) => {
  const { data } = await $host.post('api/notification/create', {
    title,
    text,
    userIds,
  });
  return data;
};
