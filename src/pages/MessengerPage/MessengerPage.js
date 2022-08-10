import { Navmenu } from 'components';
import MessengerSidemenu from './MessengerSidemenu/MessengerSidemenu';
import MessengerDialog from './MessengerDialog/MessengerDialog';
import './MessengerPage.css';
import { useSelector } from 'react-redux';

const MessengerPage = () => {
  const activeChat = useSelector((state) => state.chat.activeChat);

  return (
    <div>
      <div className="messenger-container">
        <Navmenu />
        <div className="messenger-section">
          <MessengerSidemenu />
          <div className="messenger-panel">
            {activeChat !== null && <MessengerDialog />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessengerPage;
