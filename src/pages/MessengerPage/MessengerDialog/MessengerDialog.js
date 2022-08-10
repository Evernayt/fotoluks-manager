import { createMessageAPI, fetchMessagesAPI } from 'http/chatAPI';
import { clipIcon, sendIcon } from 'icons';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import MessageItemLeft from './MessageItemLeft';
import MessageItemRight from './MessageItemRight';
import './MessengerDialog.css';

const MessengerDialog = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [bottomHeight, setBottomHeight] = useState(58);

  const activeChat = useSelector((state) => state.chat.activeChat);
  const user = useSelector((state) => state.user.user);
  const socket = useSelector((state) => state.socket.socket);
  const arrivalMessage = useSelector((state) => state.socket.arrivalMessage);

  const messageListRef = useRef();
  const messageTextAreaRef = useRef();
  const messageTextAreaFrameRef = useRef();

  useEffect(() => {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [messageTextAreaRef.current?.style.height]);

  useEffect(() => {
    if (activeChat !== null) fetchMessages();
  }, [activeChat]);

  useEffect(() => {
    if (arrivalMessage !== null && arrivalMessage.chatId === activeChat.id) {
      setMessages((prevState) => [...prevState, arrivalMessage]);
    }
  }, [arrivalMessage]);

  const fetchMessages = (page = 1) => {
    fetchMessagesAPI(activeChat.id, page)
      .then((data) => {
        setMessages(data.reverse());
      })
      .finally(() => {});
  };

  const sendMessage = () => {
    if (text.trim() !== '') {
      const message = {
        id: messages.length + 1 + '_sending',
        text: text,
        createdAt: new Date(),
        user: user,
        status: 'SENDING',
        receiverId: null,
      };
      setMessages((prevState) => [...prevState, message]);
      createMessageAPI(text, user.id, activeChat.id).then((data) => {
        const newMessage = {
          id: data.id,
          text: data.text,
          createdAt: data.createdAt,
          user: user,
          status: 'SENT',
          receiverId: null,
          chatId: activeChat.id,
        };

        setMessages((prevStates) => {
          return prevStates.map((prevMessage) =>
            prevMessage.id === message.id ? newMessage : prevMessage
          );
        });

        //socket.emit('sendMessage', newMessage);
      });
      setText('');
    }
  };

  const resizeTextArea = () => {
    messageTextAreaRef.current.style.height = '0px';
    const height = Math.min(20 * 5, messageTextAreaRef.current.scrollHeight);
    messageTextAreaFrameRef.current.style.height = height + 'px';
    messageTextAreaRef.current.style.height = height + 'px';
  };

  const sendMessageAndResize = () => {
    setTimeout(() => {
      sendMessage();
      resizeTextArea();
      messageTextAreaRef.current.focus();
    }, 0);
  };

  const autoResize = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      sendMessageAndResize();
    } else {
      setTimeout(() => {
        resizeTextArea();
      }, 0);
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="messenger-dialog-tools">
        <img
          className="messenger-dialog-tools-avatar"
          src={activeChat.user.avatar}
          alt="avatar"
        />
        <div className="messenger-dialog-tools-section">
          <span style={{fontWeight: '500'}}>{activeChat.user.name}</span>
          <span className="messenger-dialog-tools-online">в сети</span>
        </div>
      </div>
      <ul className="messenger-dialog-messages" ref={messageListRef}>
        {messages.map((message) => {
          if (message.user.id == activeChat.user.id) {
            return <MessageItemLeft message={message} key={message.id} />;
          } else {
            return <MessageItemRight message={message} key={message.id} />;
          }
        })}
      </ul>
      <div className="messenger-dialog-inputs">
        <button
          className="messenger-dialog-btn"
          onClick={() => console.log(text)}
        >
          <img src={clipIcon} alt="clip-icon" />
        </button>
        <div
          className="messenger-dialog-text-input-frame"
          ref={messageTextAreaFrameRef}
          onClick={() => messageTextAreaRef.current.focus()}
        >
          <textarea
            className="messenger-dialog-text-input"
            placeholder="Введите сообщение"
            ref={messageTextAreaRef}
            rows="1"
            value={text}
            onKeyDown={(e) => autoResize(e)}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button className="messenger-dialog-btn" onClick={sendMessageAndResize}>
          <img src={sendIcon} alt="send-icon" style={{ marginRight: '2px' }} />
        </button>
      </div>
    </div>
  );
};

export default MessengerDialog;
