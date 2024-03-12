import { ContextMenu } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { Item, ItemParams } from 'react-contexify';
import { modalActions } from 'store/reducers/ModalSlice';
import { IconDownload, IconPencil, IconTrash } from '@tabler/icons-react';
import { CONTEXT_MENU_ICON_STYLE, ICON_SIZE, ICON_STROKE } from 'constants/app';
import { IChatMessage } from 'models/api/IChatMessage';
import ChatMessageAPI from 'api/ChatMessageAPI/ChatMessageAPI';
import { messengerActions } from 'store/reducers/MessengerSlice';
import socketio from 'socket/socketio';
import 'react-contexify/ReactContexify.css';

export const MESSENGER_MESSAGE_MENU_ID = 'MESSENGER_MESSAGE_MENU_ID';

interface ItemProps {
  chatMessage: IChatMessage;
  isLeftItem: boolean;
}

const MessengerMessageContextMenu = () => {
  const chatMessages = useAppSelector((state) => state.messenger.chatMessages);

  const dispatch = useAppDispatch();

  const editMessage = (params: ItemParams<ItemProps>) => {
    const chatMessage = params.props?.chatMessage;
    dispatch(
      modalActions.openModal({
        modal: 'messengerEditMessageModal',
        props: { chatMessage },
      })
    );
  };

  const deleteMessage = (params: ItemParams<ItemProps>) => {
    const chatMessage = params.props?.chatMessage;
    if (!chatMessage) return;
    ChatMessageAPI.delete(chatMessage.id).then(() => {
      const isLastChatMessage = chatMessages[0].id === chatMessage.id;
      if (isLastChatMessage) {
        const updatedChatMessages: IChatMessage[] =
          chatMessages.length > 1 ? [chatMessages[1]] : [];
        dispatch(
          messengerActions.updateChat({
            id: chatMessage.chatId,
            chatMessages: updatedChatMessages,
          })
        );
      }

      dispatch(messengerActions.deleteChatMessage(chatMessage.id));
      socketio.deleteChatMessage(chatMessage);
    });
  };

  const download = (params: ItemParams<ItemProps>) => {
    const chatMessage = params.props?.chatMessage;
    window.electron.ipcRenderer.sendMessage(
      'download-file',
      chatMessage?.message
    );
  };

  const isImage = (params: ItemParams<ItemProps>) => {
    return params.props?.chatMessage.type === 'image';
  };

  const isLeftItem = (params: ItemParams<ItemProps>) => {
    return params.props?.isLeftItem === true;
  };

  return (
    <ContextMenu id={MESSENGER_MESSAGE_MENU_ID}>
      <Item hidden={(e) => isImage(e as ItemParams)} onClick={editMessage}>
        <IconPencil
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Изменить
      </Item>
      <Item hidden={(e) => !isImage(e as ItemParams)} onClick={download}>
        <IconDownload
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Скачать изображение
      </Item>
      <Item hidden={(e) => isLeftItem(e as ItemParams)} onClick={deleteMessage}>
        <IconTrash
          size={ICON_SIZE}
          stroke={ICON_STROKE}
          style={CONTEXT_MENU_ICON_STYLE}
        />
        Удалить
      </Item>
    </ContextMenu>
  );
};

export default MessengerMessageContextMenu;
