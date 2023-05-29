import { SERVER_API_URL } from 'constants/api';
import { INotification } from 'models/api/INotification';
import { IOrder } from 'models/api/IOrder';
import { IWatcher } from 'models/IWatcher';
import { io, Socket } from 'socket.io-client';
import store from 'store';
import { appSlice } from 'store/reducers/AppSlice';
import { employeeSlice } from 'store/reducers/EmployeeSlice';
import { orderSlice } from 'store/reducers/OrderSlice';

interface INotificationInfo {
  notification: INotification;
  employeeIds: number[];
}

let socket: Socket;

const connect = () => {
  socket = io(SERVER_API_URL);

  subscribeToNotifications();
  subscribeToOrderUpdates();
  subscribeToWatchers();
};

const disconnect = () => {
  socket?.disconnect();
};

const isConnected = () => {
  if (socket) {
    return true;
  } else {
    connect();
    return false;
  }
};

const subscribeToNotifications = () => {
  socket.on('getNotification', (data: INotificationInfo) => {
    const employee = store.getState().employee.employee;
    const isNotifForMe = data.employeeIds.some((id) => id === employee?.id);

    if (isNotifForMe) {
      window.electron.ipcRenderer.sendMessage('show-notification', [
        data.notification.title,
        data.notification.text,
      ]);

      store.dispatch(employeeSlice.actions.addNotification(data.notification));
      store.dispatch(appSlice.actions.setNoificationsBadge(true));
    }
  });
};

const subscribeToOrderUpdates = () => {
  socket.on('getOrder', (order: IOrder) => {
    store.dispatch(orderSlice.actions.updateOrder(order));
  });
};

const subscribeToWatchers = () => {
  socket.on('getWatchers', (watchers: IWatcher[]) => {
    store.dispatch(orderSlice.actions.setWatchers(watchers));
  });
};

const sendNotification = (
  notification: INotification,
  employeeIds: number[]
) => {
  if (!isConnected()) return;
  socket.emit('sendNotification', { notification, employeeIds });
};

const updateOrder = (order: IOrder) => {
  if (!isConnected()) return;
  socket.emit('updateOrder', order);
};

const addWatcher = (watcher: IWatcher) => {
  if (!isConnected()) return;
  socket.emit('addWatcher', watcher);
};

const removeWatcher = (userId: number) => {
  if (!isConnected()) return;
  socket.emit('removeWatcher', userId);
  store.dispatch(orderSlice.actions.setWatchers([]));
};

export default {
  connect,
  disconnect,
  sendNotification,
  updateOrder,
  addWatcher,
  removeWatcher,
};
