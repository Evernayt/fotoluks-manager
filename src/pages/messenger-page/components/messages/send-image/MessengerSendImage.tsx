import {
  Button,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { IconClipboard, IconPhotoPlus } from '@tabler/icons-react';
import ChatMessageAPI from 'api/ChatMessageAPI/ChatMessageAPI';
import { CreateChatMessageDto } from 'api/ChatMessageAPI/dto/create-chat-message.dto';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { isImageURL } from 'helpers';
import { getErrorToast } from 'helpers/toast';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IChatMessage } from 'models/api/IChatMessage';
import { IChatReadMessage } from 'models/api/IChatReadMessage';
import { useState } from 'react';
import socketio from 'socket/socketio';
import { messengerActions } from 'store/reducers/MessengerSlice';
import ChatReadMessageAPI from 'api/ChatReadMessageAPI/ChatReadMessageAPI';
import styles from './MessengerSendImage.module.scss';

const MessengerSendImage = () => {
  const [url, setUrl] = useState<string>('');

  const employee = useAppSelector((state) => state.employee.employee);
  const activeChat = useAppSelector((state) => state.messenger.activeChat);
  const chats = useAppSelector((state) => state.messenger.chats);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useAppDispatch();
  const toast = useToast();

  const paste = () => {
    navigator.clipboard.readText().then((text) => {
      setUrl(text);
    });
  };

  const sendImage = () => {
    if (url.trim() !== '' && employee && activeChat) {
      if (!isImageURL(url)) {
        toast(getErrorToast('Некорректная ссылка на изображение'));
        return;
      }

      const message: CreateChatMessageDto = {
        message: url,
        type: 'image',
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

        setUrl('');
        onClose();

        ChatReadMessageAPI.upsert({
          chatId: activeChat.id,
          employeeId: employee.id,
          chatMessageId: createdMessage.id,
        });
      });
    }
  };

  return (
    <Popover placement="top-start" isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <IconButton
          icon={<IconPhotoPlus className="link-icon" stroke={ICON_STROKE} />}
          aria-label="image"
          variant="ghost"
          isRound
          size="lg"
          onClick={onOpen}
        />
      </PopoverTrigger>
      <PopoverContent w="350px">
        <PopoverArrow />
        <PopoverBody className={styles.body}>
          <Input
            placeholder="Вставьте ссылку на изображение..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <IconButton
            icon={<IconClipboard size={ICON_SIZE} stroke={ICON_STROKE} />}
            aria-label="paste"
            onClick={paste}
          />
        </PopoverBody>
        <PopoverFooter>
          <Button colorScheme="yellow" w="100%" onClick={sendImage}>
            Отправить изображение
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default MessengerSendImage;
