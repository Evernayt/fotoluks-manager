import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import ChatAPI from 'api/ChatAPI/ChatAPI';
import { getErrorToast } from 'helpers/toast';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import socketio from 'socket/socketio';
import { messengerActions } from 'store/reducers/MessengerSlice';
import { modalActions } from 'store/reducers/ModalSlice';

const MessengerChatDeleteModal = () => {
  const { isOpen, chatId } = useAppSelector(
    (state) => state.modal.messengerChatDeleteModal
  );

  const dispatch = useAppDispatch();
  const toast = useToast();

  const deleteChat = () => {
    if (!chatId) return;
    ChatAPI.delete(chatId)
      .then(() => {
        dispatch(messengerActions.deleteChat(chatId));
        dispatch(messengerActions.setActiveChat(null));
        socketio.deleteChat(chatId);
        closeModal();
      })
      .catch((e) => toast(getErrorToast(e)));
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('messengerChatDeleteModal'));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Удалить чат</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Вы уверены? Чат удалится без возможности восстановления.
        </ModalBody>
        <ModalFooter>
          <Button mr="var(--space-sm)" onClick={closeModal}>
            Отмена
          </Button>
          <Button colorScheme="red" onClick={deleteChat}>
            Удалить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MessengerChatDeleteModal;
