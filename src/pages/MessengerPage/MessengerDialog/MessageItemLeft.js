import dateFormat from 'dateformat';
import './MessageItem.css';

const MessageItemLeft = ({ message }) => {
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
    <li className="message-item-container">
      <div>
        <div className="message-item-left-section">
          <div>{message.text}</div>
          <div className="message-item-date">
            {getFormattedDate(message.createdAt)}
          </div>
        </div>
      </div>
    </li>
  );
};

export default MessageItemLeft;
