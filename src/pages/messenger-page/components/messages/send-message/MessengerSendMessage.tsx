import ChatMessageAPI from 'api/ChatMessageAPI/ChatMessageAPI';
import { CreateChatMessageDto } from 'api/ChatMessageAPI/dto/create-chat-message.dto';
import ChatReadMessageAPI from 'api/ChatReadMessageAPI/ChatReadMessageAPI';
import { MessageInput } from 'components';
import EmojiPicker from 'components/ui/emoji-picker/EmojiPicker';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IChatMessage } from 'models/api/IChatMessage';
import { IChatReadMessage } from 'models/api/IChatReadMessage';
import { useState } from 'react';
import socketio from 'socket/socketio';
import { messengerActions } from 'store/reducers/MessengerSlice';

const MessengerSendMessage = () => {
  const [text, setText] = useState<string>('');

  const employee = useAppSelector((state) => state.employee.employee);
  const activeChat = useAppSelector((state) => state.messenger.activeChat);
  const chats = useAppSelector((state) => state.messenger.chats);

  const dispatch = useAppDispatch();

  const sendMessage = () => {
    if (text.trim() !== '' && employee && activeChat) {
      const message: CreateChatMessageDto = {
        message: text,
        type: 'text',
        chatId: activeChat.id,
        employeeId: employee.id,
      };
      ChatMessageAPI.create(message).then((data) => {
        const createdMessage: IChatMessage = {
          ...data,
          employee,
        };
        dispatch(messengerActions.addChatMessage(createdMessage));

        const chatReadMessage: IChatReadMessage = {
          id: 1,
          chatId: activeChat.id,
          employeeId: employee.id,
          chatMessageId: createdMessage.id,
        };

        let updatedChats = chats.map((chat) =>
          chat.id === createdMessage.chatId
            ? {
                ...chat,
                chatMessages: [createdMessage],
                chatReadMessages: [chatReadMessage],
                latestMessageId: createdMessage.id,
              }
            : chat
        );
        updatedChats = updatedChats.sort(
          (a, b) =>
            (b.latestMessageId || Infinity) - (a.latestMessageId || Infinity)
        );
        dispatch(messengerActions.setChats(updatedChats));

        const employeeIds = activeChat.chatMembers?.map(
          (chatMember) => chatMember.employeeId
        );
        socketio.sendChatMessage(createdMessage, employeeIds || []);

        setText('');

        ChatReadMessageAPI.upsert({
          chatId: activeChat.id,
          employeeId: employee.id,
          chatMessageId: createdMessage.id,
        });
      });
    }
  };

  return (
    <>
      <EmojiPicker
        onEmojiSelect={(emoji) =>
          setText((prevState) => prevState + emoji.native)
        }
      />
      <MessageInput
        value={text}
        placeholder="Введите сообщение"
        onButtonClick={sendMessage}
        onChange={(e) => setText(e.target.value)}
      />
    </>
  );
};

export default MessengerSendMessage;
