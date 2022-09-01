import { SERVER_API_URL } from 'constants/api';
import { INotification } from 'models/INotification';
import { IOrder } from 'models/IOrder';
import { IUser } from 'models/IUser';
import { IWatcher } from 'models/IWatcher';
import { io, Socket } from 'socket.io-client';
import store from 'store';
import { appSlice } from 'store/reducers/AppSlice';
import { orderSlice } from 'store/reducers/OrderSlice';
import { userSlice } from 'store/reducers/UserSlice';

let socket: Socket;

const connect = (user: IUser) => {
  socket = io(SERVER_API_URL);
  socket.emit('addUser', user);

  subscribeToNotifications();
  subscribeToOrderUpdates();
  subscribeToWatchers();
};

const disconnect = () => {
  socket.disconnect();
};

const isConnected = () => {
  if (socket === undefined) {
    connect(store.getState().user.user!);
    return false;
  } else {
    return true;
  }
};

const subscribeToNotifications = () => {
  socket.on('getNotification', (notification: INotification) => {
    window.electron.ipcRenderer.sendMessage('show-notification', [
      notification.title,
      notification.text,
    ]);

    store.dispatch(userSlice.actions.addNotification(notification));
    store.dispatch(appSlice.actions.setNoificationsBadge(true));
  });
};

const subscribeToOrderUpdates = () => {
  socket.on('getOrder', (order: IOrder) => {
    console.log(order)
    store.dispatch(orderSlice.actions.updateOrder(order));
  });
};

const subscribeToWatchers = () => {
  socket.on('getWatchers', (watchers: IWatcher[]) => {
    store.dispatch(orderSlice.actions.setWatchers(watchers));
  });
};

const sendNotification = (notification: INotification) => {
  if (!isConnected()) return;
  socket.emit('sendNotification', notification);
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
