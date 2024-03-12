import { SERVER_API_URL } from 'constants/api';
import { getEmployeeShortName } from 'helpers/employee';
import { IChat } from 'models/api/IChat';
import { IChatMessage } from 'models/api/IChatMessage';
import { IChatReadMessage } from 'models/api/IChatReadMessage';
import { INotification } from 'models/api/INotification';
import { IOrder } from 'models/api/IOrder';
import { IEditor } from 'models/IEditor';
import { IOnlineEmployee } from 'models/IOnlineEmployee';
import { io, Socket } from 'socket.io-client';
import store from 'store';
import { appActions } from 'store/reducers/AppSlice';
import { employeeActions } from 'store/reducers/EmployeeSlice';
import { messengerActions } from 'store/reducers/MessengerSlice';
import { moveActions } from 'store/reducers/MoveSlice';
import { orderActions } from 'store/reducers/OrderSlice';

interface INotificationInfo {
  notification: INotification;
  employeeIds: number[];
}

interface IChatMessageInfo {
  chatMessage: IChatMessage;
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
  subscribeToChatUpdates();
  subscribeToDeleteChat();
  subscribeToChatMessages();
  subscribeToChatMessageUpdates();
  subscribeToDeleteChatMessage();

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
  socket.on(
    'getNotification',
    (data: INotificationInfo, senderEmployeeId: number) => {
      const employee = store.getState().employee.employee;
      if (senderEmployeeId === employee?.id) return;

      const isNotifForMe = data.employeeIds.some((id) => id === employee?.id);

      if (isNotifForMe) {
        window.electron.ipcRenderer.sendMessage('show-notification', [
          data.notification.title,
          data.notification.text,
        ]);

        store.dispatch(employeeActions.addNotification(data.notification));
        store.dispatch(appActions.setNoificationsBadge(true));
      }
    }
  );
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

const subscribeToChatUpdates = () => {
  socket.on('getChat', (chat: IChat) => {
    const chats = store.getState().messenger.chats;
    const employee = store.getState().employee.employee;
    const iMember = chat.chatMembers?.some(
      (chatMember) => chatMember.employeeId === employee?.id
    );
    const isChatCreated = chats.some((x) => x.id === chat.id);

    if (isChatCreated) {
      const activeChat = store.getState().messenger.activeChat;
      const isActiveChat = chat.id === activeChat?.id;

      if (iMember) {
        store.dispatch(messengerActions.updateChat(chat));
        if (isActiveChat) {
          store.dispatch(messengerActions.setActiveChat(chat));
        }
      } else {
        store.dispatch(messengerActions.deleteChat(chat.id));
        if (isActiveChat) {
          store.dispatch(messengerActions.setActiveChat(null));
        }
      }
    } else {
      if (iMember) {
        store.dispatch(messengerActions.addChat(chat));
      }
    }
  });
};

const subscribeToDeleteChat = () => {
  socket.on('getDeleteChat', (chatId: number) => {
    store.dispatch(messengerActions.deleteChat(chatId));
  });
};

const subscribeToChatMessages = () => {
  socket.on('getChatMessage', (data: IChatMessageInfo) => {
    const employee = store.getState().employee.employee;
    const isMessageForMe = data.employeeIds.some((id) => id === employee?.id);

    if (isMessageForMe) {
      const activeChat = store.getState().messenger.activeChat;
      const isActiveChat = data.chatMessage.chatId === activeChat?.id;

      if (isActiveChat) {
        let chatMessages = [
          ...store.getState().messenger.chatMessages,
          data.chatMessage,
        ];
        chatMessages = chatMessages.sort((a, b) => b.id - a.id);
        store.dispatch(messengerActions.setChatMessages(chatMessages));
      }

      const chatReadMessage: IChatReadMessage = {
        id: 1,
        chatId: data.chatMessage.chatId,
        employeeId: data.chatMessage.employee.id,
        chatMessageId: data.chatMessage.id,
      };

      let chats = store.getState().messenger.chats.map((chat) =>
        chat.id === data.chatMessage.chatId
          ? {
              ...chat,
              chatMessages: [data.chatMessage],
              chatReadMessages: isActiveChat
                ? [chatReadMessage]
                : chat.chatReadMessages,
              latestMessageId: data.chatMessage.id,
            }
          : chat
      );
      chats = chats.sort(
        (a, b) =>
          (b.latestMessageId || Infinity) - (a.latestMessageId || Infinity)
      );
      store.dispatch(messengerActions.setChats(chats));

      window.electron.ipcRenderer.sendMessage('show-notification', [
        getEmployeeShortName(data.chatMessage.employee),
        data.chatMessage.message,
      ]);
    }
  });
};

const subscribeToChatMessageUpdates = () => {
  socket.on('getChatMessageUpdates', (chatMessage: IChatMessage) => {
    const activeChat = store.getState().messenger.activeChat;
    const isActiveChat = chatMessage.chatId === activeChat?.id;

    if (isActiveChat) {
      const chatMessages = store.getState().messenger.chatMessages;
      const isLastChatMessage = chatMessages[0].id === chatMessage.id;

      if (isLastChatMessage) {
        store.dispatch(
          messengerActions.updateChat({
            id: chatMessage.chatId,
            chatMessages: [chatMessage],
          })
        );
      }

      store.dispatch(messengerActions.updateChatMessage(chatMessage));
    }
  });
};

const subscribeToDeleteChatMessage = () => {
  socket.on('getDeleteChatMessage', (chatMessage: IChatMessage) => {
    const chatMessages = store.getState().messenger.chatMessages;
    const isLastChatMessage = chatMessages[0].id === chatMessage.id;

    if (isLastChatMessage) {
      const updatedChatMessages: IChatMessage[] =
        chatMessages.length > 1 ? [chatMessages[1]] : [];
      store.dispatch(
        messengerActions.updateChat({
          id: chatMessage.chatId,
          chatMessages: updatedChatMessages,
        })
      );
    }

    store.dispatch(messengerActions.deleteChatMessage(chatMessage.id));
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

const updateChat = (chat: IChat) => {
  if (!isConnected()) return;
  socket.emit('updateChat', chat);
};

const deleteChat = (chatId: number) => {
  if (!isConnected()) return;
  socket.emit('deleteChat', chatId);
};

const sendChatMessage = (chatMessage: IChatMessage, employeeIds: number[]) => {
  if (!isConnected()) return;
  socket.emit('sendChatMessage', { chatMessage, employeeIds });
};

const updateChatMessage = (chatMessage: IChatMessage) => {
  if (!isConnected()) return;
  socket.emit('updateChatMessage', chatMessage);
};

const deleteChatMessage = (chatMessage: IChatMessage) => {
  if (!isConnected()) return;
  socket.emit('deleteChatMessage', chatMessage);
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
  updateChat,
  deleteChat,
  sendChatMessage,
  updateChatMessage,
  deleteChatMessage,
};
