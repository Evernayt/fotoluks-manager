import { SERVER_API_URL } from 'constants/api';
import { IUser } from 'models/IUser';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

const connect = (user: IUser) => {
  socket = io(SERVER_API_URL);
  socket.emit('addUser', user);

  subscribeToNotifications();
};

const subscribeToNotifications = () => {
  socket.on('getNotification', (title, text) => {
    window.electron.ipcRenderer.sendMessage('show-notification', [title, text]);
  });
};

const sendNotification = (title: string, text: string) => {
  socket.emit('sendNotification', title, text);
};

export default { connect, sendNotification };
