import dateFormat from 'dateformat';
import './MessageItem.css';

const MessageItemRight = ({ message }) => {
  const getFormattedDate = (date) => {
    const currentDate = new Date();
    const oldDate = new Date(date);

    if (currentDate.getFullYear() !== oldDate.getFullYear()) {
      return dateFormat(oldDate, 'dd.mm.yyyy hh:MM');
    } else if (currentDate.getDate() !== oldDate.getDate()) {
      return dateFormat(oldDate, 'dd.mm hh:MM');
    } else {
      return dateFormat(oldDate, 'hh:MM');
    }
  };

  return (
    <li
      className="message-item-container"
      style={{ justifyContent: 'flex-end', marginLeft: 'auto' }}
    >
      <div>
        <div className="message-item-name">{message.user.name}</div>
        <div className="message-item-right-section">
          <div>{message.text}</div>
          <div className="message-item-date" style={{ color: '#AB9B4D' }}>
            {getFormattedDate(message.createdAt)}
          </div>
        </div>
      </div>
      <img
        className="message-item-avatar"
        src={message.user.avatar}
        alt="avatar"
      />
    </li>
  );
};

export default MessageItemRight;
