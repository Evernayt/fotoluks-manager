import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';
import {
  Divider,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { MessageInput } from 'components';
import { IconPencil } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { IChatMessage } from 'models/api/IChatMessage';
import ChatMessageAPI from 'api/ChatMessageAPI/ChatMessageAPI';
import { messengerActions } from 'store/reducers/MessengerSlice';
import MessengerMessageItemRight from 'pages/messenger-page/components/messages/message-item/MessengerMessageItemRight';
import socketio from 'socket/socketio';
import styles from './MessengerEditMessageModal.module.scss';
import EmojiPicker from 'components/ui/emoji-picker/EmojiPicker';

const MessengerEditMessageModal = () => {
  const [text, setText] = useState<string>('');

  const { isOpen, chatMessage } = useAppSelector(
    (state) => state.modal.messengerEditMessageModal
  );
  const chatMessages = useAppSelector((state) => state.messenger.chatMessages);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      setText(chatMessage?.message || '');
    }
  }, [isOpen]);

  const closeModal = () => {
    dispatch(modalActions.closeModal('messengerEditMessageModal'));
  };

  const editMessage = () => {
    if (!chatMessage) return;
    const updatedChatMessage: IChatMessage = {
      ...chatMessage,
      message: text,
      edited: true,
    };
    ChatMessageAPI.update(updatedChatMessage).then(() => {
      const isLastChatMessage = chatMessages[0].id === updatedChatMessage.id;

      if (isLastChatMessage) {
        dispatch(
          messengerActions.updateChat({
            id: chatMessage.chatId,
            chatMessages: [updatedChatMessage],
          })
        );
      }

      dispatch(messengerActions.updateChatMessage(updatedChatMessage));
      socketio.updateChatMessage(updatedChatMessage);
      closeModal();
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Изменить сообщение</ModalHeader>
        <ModalCloseButton />
        <div className={styles.message_container}>
          <MessengerMessageItemRight
            className={styles.message}
            chatMessage={chatMessage!}
          />
        </div>
        <Divider />
        <div className={styles.message_input}>
          <EmojiPicker
            onEmojiSelect={(emoji) =>
              setText((prevState) => prevState + emoji.native)
            }
          />
          <MessageInput
            value={text}
            placeholder="Введите сообщение"
            icon={<IconPencil className={'link-icon'} />}
            onButtonClick={editMessage}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </ModalContent>
    </Modal>
  );
};

export default MessengerEditMessageModal;
