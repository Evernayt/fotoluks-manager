import { Avatar, Heading, Text } from '@chakra-ui/react';
import { getDateDiff } from 'helpers';
import { FC } from 'react';
import { IChat } from 'models/api/IChat';
import { useAppDispatch } from 'hooks/redux';
import { messengerActions } from 'store/reducers/MessengerSlice';
import ChatReadMessageAPI from 'api/ChatReadMessageAPI/ChatReadMessageAPI';
import { IChatReadMessage } from 'models/api/IChatReadMessage';
import styles from './MessengerChat.module.scss';

interface MessengerChatProps {
  chat: IChat;
  activeChat: IChat | null;
  employeeId: number | undefined;
}

const MessengerChat: FC<MessengerChatProps> = ({
  chat,
  activeChat,
  employeeId,
}) => {
  const isActive = activeChat?.id === chat.id;
  const chatMessage =
    chat.chatMessages && chat.chatMessages.length > 0
      ? chat.chatMessages[0]
      : null;

  const dispatch = useAppDispatch();

  const isUnread = () => {
    if (
      chat.latestMessageId &&
      chat.chatReadMessages &&
      chat.chatReadMessages.length > 0
    ) {
      return (
        chat.latestMessageId > (chat.chatReadMessages[0].chatMessageId || 0)
      );
    } else {
      return true;
    }
  };

  const selectChat = () => {
    if (activeChat?.id === chat.id || !employeeId) return;
    dispatch(messengerActions.setActiveChat(chat));

    const chatReadMessage: IChatReadMessage = {
      id: 1,
      chatId: chat.id,
      employeeId,
      chatMessageId: chat.latestMessageId,
    };
    dispatch(
      messengerActions.updateChat({
        id: chat.id,
        chatReadMessages: [chatReadMessage],
      })
    );
    ChatReadMessageAPI.upsert({
      chatId: chat.id,
      employeeId,
      chatMessageId: chat.latestMessageId,
    });
  };

  return (
    <div
      className={[styles.container, isActive && styles.active].join(' ')}
      onClick={selectChat}
    >
      <Avatar src={chat.image} h="48px" w="48px" />
      <div>
        <div className={styles.group}>
          <Heading className={styles.name} size="sm">
            {chat.name}
          </Heading>
          <Text className={styles.date}>
            {chatMessage?.updatedAt
              ? getDateDiff(chatMessage.updatedAt).diff
              : null}
          </Text>
        </div>
        <div className={styles.group}>
          <Text className={styles.last_message} variant="secondary">
            {chatMessage?.type === 'image' ? (
              <i>Изображение</i>
            ) : (
              chatMessage?.message || <i>Нет сообщений</i>
            )}
          </Text>
          {isUnread() && <div className={styles.badge} />}
        </div>
      </div>
    </div>
  );
};

export default MessengerChat;
