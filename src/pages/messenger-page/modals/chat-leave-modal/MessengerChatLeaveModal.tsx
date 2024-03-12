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

const MessengerChatLeaveModal = () => {
  const { isOpen, chatId, employeeId, creatorId } = useAppSelector(
    (state) => state.modal.messengerChatLeaveModal
  );

  const dispatch = useAppDispatch();
  const toast = useToast();

  const leaveChat = () => {
    ChatAPI.leave({ id: chatId, employeeId, creatorId })
      .then((data) => {
        dispatch(messengerActions.deleteChat(data.id));
        dispatch(messengerActions.setActiveChat(null));
        socketio.updateChat(data);
        closeModal();
      })
      .catch((e) => toast(getErrorToast(e)));
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('messengerChatLeaveModal'));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Выйти из чата</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Вы уверены? Вы не сможете отменить это действие.</ModalBody>
        <ModalFooter>
          <Button mr="var(--space-sm)" onClick={closeModal}>
            Отмена
          </Button>
          <Button colorScheme="red" onClick={leaveChat}>
            Выйти
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MessengerChatLeaveModal;
