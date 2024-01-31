import { SERVER_API_URL } from 'constants/api';
import { INotification } from 'models/api/INotification';
import { IOrder } from 'models/api/IOrder';
import { IEditor } from 'models/IEditor';
import { IOnlineEmployee } from 'models/IOnlineEmployee';
import { io, Socket } from 'socket.io-client';
import store from 'store';
import { appActions } from 'store/reducers/AppSlice';
import { employeeActions } from 'store/reducers/EmployeeSlice';
import { moveActions } from 'store/reducers/MoveSlice';
import { orderActions } from 'store/reducers/OrderSlice';

interface INotificationInfo {
  notification: INotification;
  employeeIds: number[];
}

let socket: Socket;

const connect = (employeeId: number) => {
  socket = io(SERVER_API_URL);

  subscribeToOnlineEmployees();
  subscribeToNotifications();
  subscribeToOrderUpdates();
  subscribeToOrderEditors();
  subscribeToMoveEditors();

  socket.emit('addOnlineEmployee', employeeId);
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

const subscribeToOnlineEmployees = () => {
  socket.on('getOnlineEmployees', (onlineEmployees: IOnlineEmployee[]) => {
    store.dispatch(appActions.setOnlineEmployees(onlineEmployees));
  });
};

const subscribeToOrderEditors = () => {
  socket.on('getOrderEditors', (orderEditors: IEditor[]) => {
    store.dispatch(orderActions.setOrderEditors(orderEditors));
  });
};

const subscribeToMoveEditors = () => {
  socket.on('getMoveEditors', (moveEditors: IEditor[]) => {
    store.dispatch(moveActions.setMoveEditors(moveEditors));
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

const addOrderEditor = (orderEditor: IEditor) => {
  if (!isConnected()) return;
  socket.emit('addOrderEditor', orderEditor);
};

const removeOrderEditor = (employeeId: number) => {
  if (!isConnected()) return;
  socket.emit('removeOrderEditor', employeeId);
  store.dispatch(orderActions.deleteOrderEditorByEmployeeId(employeeId));
};

const addMoveEditor = (moveEditor: IEditor) => {
  if (!isConnected()) return;
  socket.emit('addMoveEditor', moveEditor);
};

const removeMoveEditor = (employeeId: number) => {
  if (!isConnected()) return;
  socket.emit('removeMoveEditor', employeeId);
  store.dispatch(moveActions.deleteMoveEditorByEmployeeId(employeeId));
};

export default {
  connect,
  disconnect,
  sendNotification,
  updateOrder,
  addOrderEditor,
  removeOrderEditor,
  addMoveEditor,
  removeMoveEditor,
};
