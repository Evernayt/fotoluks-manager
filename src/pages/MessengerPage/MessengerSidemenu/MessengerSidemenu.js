import { SelectButton } from 'components';
import { fetchChatGroupsAPI, fetchChatsAPI } from 'http/chatAPI';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveChatAction } from 'store/chatReducer';
import './MessengerSidemenu.css';

const MessengerSidemenu = () => {
  const [chats, setChats] = useState([]);
  const [chatGroups, setChatGroups] = useState([]);
  const [activeChatGroup, setActiveChatGroup] = useState(null);

  const activeChat = useSelector((state) => state.chat.activeChat);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchChatGroups();
  }, []);

  useEffect(() => {
    fetchChats();
  }, [activeChatGroup]);

  const fetchChats = () => {
    fetchChatsAPI((activeChatGroup)).then((data) => {
      setChats(data);
    });
  };

  const fetchChatGroups = () => {
    fetchChatGroupsAPI().then((data) => {
      setChatGroups(data);
    });
  };

  const setActiveChat = (chat) => {
    dispatch(setActiveChatAction(chat));
  };

  const getDateDiff = (date) => {
    const currentDate = new Date();

    let delta = Math.abs(Date.parse(date) - currentDate) / 1000;

    const years = Math.floor(delta / 31536000);
    delta -= years * 31536000;

    if (years > 0) {
      return years + ' г.';
    } else {
      const days = Math.floor(delta / 86400);
      delta -= days * 86400;

      if (days > 0) {
        return days + ' д.';
      } else {
        const hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        if (hours > 0) {
          return hours + ' ч.';
        } else {
          const minutes = Math.floor(delta / 60) % 60;
          return minutes + ' мин.';
        }
      }
    }
  };

  return (
    <div className="messenger-sidemenu-container">
      <SelectButton
        items={chatGroups}
        defaultSelectedItem={chatGroups[0]}
        onChange={(e) => setActiveChatGroup(e.id)}
      />
      <div className="messenger-sidemenu-separator" />
      {chats.map((chat) => {
        return (
          <div key={chat.id}>
            <input
              id={chat.id}
              name="messenger-sidemenu"
              type="radio"
              checked={activeChat?.id === chat.id}
              onChange={() => setActiveChat(chat)}
            />
            <label className="messenger-sidemenu-rbtn" htmlFor={chat.id}>
              <img
                className="messenger-sidemenu-rbtn-avatar"
                src={chat.user.avatar}
                alt="avatar"
              />
              <div className="messenger-sidemenu-rbtn-section">
                <span className="messenger-sidemenu-rbtn-name">
                  {chat.user.name}
                </span>
                <div style={{ display: 'flex' }}>
                  <span className="messenger-sidemenu-rbtn-message">
                    {chat.messages[0].text}
                  </span>
                  <span
                    className="messenger-sidemenu-rbtn-date"
                    style={{ margin: '0 4px' }}
                  >
                    {'·'}
                  </span>
                  <span className="messenger-sidemenu-rbtn-date">
                    {getDateDiff(chat.messages[0].createdAt)}
                  </span>
                </div>
              </div>
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default MessengerSidemenu;
