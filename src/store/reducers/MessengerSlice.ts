import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FETCH_MORE_LIMIT } from 'constants/app';
import { IChat } from 'models/api/IChat';
import { IChatMessage } from 'models/api/IChatMessage';

type MessengerState = {
  chats: IChat[];
  activeChat: IChat | null;
  chatMessages: IChatMessage[];
};

const initialState: MessengerState = {
  chats: [],
  activeChat: null,
  chatMessages: [],
};

export const messengerSlice = createSlice({
  name: 'messenger',
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<IChat[]>) {
      state.chats = action.payload;
    },
    addChats(state, action: PayloadAction<IChat[]>) {
      state.chats.push(...action.payload);
    },
    addChat(state, action: PayloadAction<IChat>) {
      state.chats.unshift(action.payload);
      if (state.chats.length > FETCH_MORE_LIMIT) {
        state.chats.pop();
      }
    },
    setActiveChat(state, action: PayloadAction<IChat | null>) {
      state.activeChat = action.payload;
    },
    updateChat(state, action: PayloadAction<Partial<IChat>>) {
      state.chats = state.chats.map((chat) =>
        chat.id === action.payload.id ? { ...chat, ...action.payload } : chat
      );
    },
    deleteChat(state, action: PayloadAction<number>) {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);
    },
    setChatMessages(state, action: PayloadAction<IChatMessage[]>) {
      state.chatMessages = action.payload;
    },
    addChatMessages(state, action: PayloadAction<IChatMessage[]>) {
      state.chatMessages.push(...action.payload);
    },
    addChatMessage(state, action: PayloadAction<IChatMessage>) {
      state.chatMessages.unshift(action.payload);
      if (state.chatMessages.length > FETCH_MORE_LIMIT) {
        state.chatMessages.pop();
      }
    },
    updateChatMessage(state, action: PayloadAction<IChatMessage>) {
      state.chatMessages = state.chatMessages.map((chatMessage) =>
        chatMessage.id === action.payload.id ? action.payload : chatMessage
      );
    },
    deleteChatMessage(state, action: PayloadAction<number>) {
      state.chatMessages = state.chatMessages.filter(
        (chatMessage) => chatMessage.id !== action.payload
      );
    },
    clearState() {
      return initialState;
    },
  },
});

export const messengerActions = messengerSlice.actions;
export default messengerSlice.reducer;
