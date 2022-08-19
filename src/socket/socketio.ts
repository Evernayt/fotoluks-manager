import { SERVER_API_URL } from 'constants/api';
import { INotification } from 'models/INotification';
import { IOrder } from 'models/IOrder';
import { IUser } from 'models/IUser';
import { io, Socket } from 'socket.io-client';
import store from 'store';
import { orderSlice } from 'store/reducers/OrderSlice';
import { userSlice } from 'store/reducers/UserSlice';

let socket: Socket;

const connect = (user: IUser) => {
  socket = io(SERVER_API_URL);
  socket.emit('addUser', user);

  subscribeToNotifications();
  subscribeToOrderUpdates();
};

const disconnect = () => {
  socket.disconnect();
};

const subscribeToNotifications = () => {
  socket.on('getNotification', (notification: INotification) => {
    window.electron.ipcRenderer.sendMessage('show-notification', [
      notification.title,
      notification.text,
    ]);

    store.dispatch(userSlice.actions.addNotification(notification));
  });
};

const subscribeToOrderUpdates = () => {
  socket.on('getOrder', (order: IOrder) => {
    store.dispatch(orderSlice.actions.updateOrder(order));
  });
};

const sendNotification = (notification: INotification) => {
  socket.emit('sendNotification', notification);
};

const updateOrder = (order: IOrder) => {
  socket.emit('updateOrder', order);
};

export default { connect, disconnect, sendNotification, updateOrder };
