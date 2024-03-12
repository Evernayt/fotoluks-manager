import {
  Avatar,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { Toolbar } from 'components';
import { IChat } from 'models/api/IChat';
import { FC } from 'react';
import MessengerMembersMenu from './members-menu/MessengerMembersMenu';
import {
  IconDotsVertical,
  IconLogout,
  IconMessageCircleX,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE, MODES } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';
import { messengerActions } from 'store/reducers/MessengerSlice';
import styles from './MessengerToolbar.module.scss';

interface MessengerToolbarProps {
  activeChat: IChat;
}

const MessengerToolbar: FC<MessengerToolbarProps> = ({ activeChat }) => {
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();

  const closeChat = () => {
    dispatch(messengerActions.setActiveChat(null));
    dispatch(messengerActions.setChatMessages([]));
  };

  const openMessengerChatEditModal = () => {
    dispatch(
      modalActions.openModal({
        modal: 'messengerChatEditModal',
        props: { mode: MODES.EDIT_MODE, chatId: activeChat.id },
      })
    );
  };

  const openMessengerChatDeleteModal = () => {
    dispatch(
      modalActions.openModal({
        modal: 'messengerChatDeleteModal',
        props: { chatId: activeChat.id },
      })
    );
  };

  const openMessengerChatLeaveModal = () => {
    dispatch(
      modalActions.openModal({
        modal: 'messengerChatLeaveModal',
        props: {
          chatId: activeChat.id,
          employeeId: employee?.id,
          creatorId: activeChat.creatorId,
        },
      })
    );
  };

  const leftSection = () => {
    return (
      <div className={styles.chat_container}>
        <Avatar src={activeChat.image} />
        <div>
          <Heading className={styles.name} size="sm">
            {activeChat.name}
          </Heading>
          <MessengerMembersMenu
            chatMembers={activeChat.chatMembers || []}
            creator={activeChat.creator}
          />
        </div>
      </div>
    );
  };

  const rightSection = () => {
    return (
      <Menu autoSelect={false}>
        <MenuButton
          as={IconButton}
          icon={
            <IconDotsVertical
              className="link-icon"
              size={ICON_SIZE}
              stroke={ICON_STROKE}
            />
          }
          aria-label="menu"
          variant="ghost"
        />
        <MenuList>
          <MenuItem
            icon={<IconMessageCircleX size={ICON_SIZE} stroke={ICON_STROKE} />}
            command="Esc"
            onClick={closeChat}
          >
            Закрыть чат
          </MenuItem>
          <MenuDivider />
          {activeChat.creatorId === employee?.id && (
            <>
              <MenuItem
                icon={<IconPencil size={ICON_SIZE} stroke={ICON_STROKE} />}
                onClick={openMessengerChatEditModal}
              >
                Редактировать чат
              </MenuItem>
              <MenuItem
                icon={<IconTrash size={ICON_SIZE} stroke={ICON_STROKE} />}
                onClick={openMessengerChatDeleteModal}
              >
                Удалить чат
              </MenuItem>
              <MenuDivider />
            </>
          )}
          <MenuItem
            icon={
              <IconLogout
                size={ICON_SIZE}
                stroke={ICON_STROKE}
                style={{ marginLeft: '2px' }}
              />
            }
            onClick={openMessengerChatLeaveModal}
          >
            Выйти из чата
          </MenuItem>
        </MenuList>
      </Menu>
    );
  };

  return <Toolbar leftSection={leftSection()} rightSection={rightSection()} />;
};

export default MessengerToolbar;
