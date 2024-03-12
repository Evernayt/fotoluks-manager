import { useAppDispatch } from 'hooks/redux';
import { GlobalHotKeys } from 'react-hotkeys';
import { messengerActions } from 'store/reducers/MessengerSlice';

const keyMap = {
  CLOSE_CHAT: 'esc',
};

const MessengerHotkeys = () => {
  const dispatch = useAppDispatch();

  const closeChat = () => {
    dispatch(messengerActions.setActiveChat(null));
    dispatch(messengerActions.setChatMessages([]));
  };

  const handlers = {
    CLOSE_CHAT: closeChat,
  };

  return <GlobalHotKeys keyMap={keyMap} handlers={handlers} />;
};

export default MessengerHotkeys;
