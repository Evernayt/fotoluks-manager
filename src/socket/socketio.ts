import { SERVER_API_URL } from 'constants/api';
import { INotification } from 'models/api/INotification';
import { IOrder } from 'models/api/IOrder';
import { IOnlineEmployee } from 'models/IOnlineEmployee';
import { IWatcher } from 'models/IWatcher';
import { io, Socket } from 'socket.io-client';
import store from 'store';
import { appActions } from 'store/reducers/AppSlice';
import { employeeActions } from 'store/reducers/EmployeeSlice';
import { orderActions } from 'store/reducers/OrderSlice';

interface INotificationInfo {
  notification: INotification;
  employeeIds: number[];
}

let socket: Socket;

const connect = (employeeId: number) => {
  socket = io(SERVER_API_URL);

  subscribeToNotifications();
  subscribeToOrderUpdates();
  subscribeToWatchers();
  subscribeToOnlineEmployees();

  socket.emit('addEmployee', employeeId);
};

const disconnect = () => {
  socket?.disconnect();
};

const isConnected = () => {
  if (socket) {
    return true;
  } else {
    const employee = store.getState().employee.employee;
    connect(employee?.id || 0);
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

      store.dispatch(employeeActions.addNotification(data.notification));
      store.dispatch(appActions.setNoificationsBadge(true));
    }
  });
};

const subscribeToOrderUpdates = () => {
  socket.on('getOrder', (order: IOrder) => {
    store.dispatch(orderActions.updateOrder(order));
  });
};

const subscribeToWatchers = () => {
  socket.on('getWatchers', (watchers: IWatcher[]) => {
    store.dispatch(orderActions.setWatchers(watchers));
  });
};

const subscribeToOnlineEmployees = () => {
  socket.on('getEmployees', (onlineEmployees: IOnlineEmployee[]) => {
    store.dispatch(appActions.setOnlineEmployees(onlineEmployees));
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
  store.dispatch(orderActions.setWatchers([]));
};

export default {
  connect,
  disconnect,
  sendNotification,
  updateOrder,
  addWatcher,
  removeWatcher,
};
