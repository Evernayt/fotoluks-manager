import { useAppDispatch } from 'hooks/redux';
import { Button, Divider } from '@chakra-ui/react';
import { IconMessageCirclePlus } from '@tabler/icons-react';
import { modalActions } from 'store/reducers/ModalSlice';
import { MODES } from 'constants/app';
import MessengerChats from './chats/MessengerChats';
import styles from './MessengerSidebar.module.scss';

const MessengerSidebar = () => {
  const dispatch = useAppDispatch();

  const openMessengerChatEditModal = () => {
    dispatch(
      modalActions.openModal({
        modal: 'messengerChatEditModal',
        props: { mode: MODES.ADD_MODE },
      })
    );
  };

  return (
    <div className={styles.container}>
      <Button
        leftIcon={<IconMessageCirclePlus />}
        colorScheme="yellow"
        w="100%"
        h="42px"
        gap="4px"
        onClick={openMessengerChatEditModal}
      >
        Новый чат
      </Button>
      <MessengerChats />
    </div>
  );
};

export default MessengerSidebar;
