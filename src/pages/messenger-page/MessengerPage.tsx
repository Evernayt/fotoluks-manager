import { Card } from '@chakra-ui/react';
import MessengerSidebar from './components/sidebar/MessengerSidebar';
import MessengerMessages from './components/messages/MessengerMessages';
import MessengerChatEditModal from './modals/chat-edit-modal/MessengerChatEditModal';
import MessengerChatDeleteModal from './modals/chat-delete-modal/MessengerChatDeleteModal';
import MessengerChatLeaveModal from './modals/chat-leave-modal/MessengerChatLeaveModal';
import MessengerEditMessageModal from './modals/edit-message-modal/MessengerEditMessageModal';
import MessengerHotkeys from './hotkeys/MessengerHotkeys';
import styles from './MessengerPage.module.scss';

const MessengerPage = () => {
  return (
    <>
      <MessengerHotkeys />
      <div className={styles.container}>
        <MessengerEditMessageModal />
        <MessengerChatLeaveModal />
        <MessengerChatDeleteModal />
        <MessengerChatEditModal />
        <MessengerSidebar />
        <Card className={styles.panel}>
          <MessengerMessages />
        </Card>
      </div>
    </>
  );
};

export default MessengerPage;
