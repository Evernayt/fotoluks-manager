import moment from 'moment';
import { FC } from 'react';
import { UI_DATE_FORMAT } from 'constants/app';
import { Linkify, ZoomableImage } from 'components';
import { Avatar, Text } from '@chakra-ui/react';
import { getEmployeeFullName } from 'helpers/employee';
import { IChatMessage } from 'models/api/IChatMessage';
import { useContextMenu } from 'react-contexify';
import { MESSENGER_MESSAGE_MENU_ID } from '../context-menu/MessengerMessageContextMenu';
import styles from './MessengerMessageItem.module.scss';

interface MessengerMessageItemProps {
  chatMessage: IChatMessage;
}

const MessengerMessageItemLeft: FC<MessengerMessageItemProps> = ({
  chatMessage,
}) => {
  const created = moment(chatMessage.createdAt).format(UI_DATE_FORMAT);

  const { show } = useContextMenu({ id: MESSENGER_MESSAGE_MENU_ID });

  const handleContextMenu = (event: any) => {
    show({ event, props: { chatMessage, isLeftItem: true } });
  };

  const getEditedText = chatMessage.edited ? '(изменено)' : '';

  return (
    <div className={styles.container} onContextMenu={handleContextMenu}>
      <Avatar
        className={styles.avatar}
        name={getEmployeeFullName(chatMessage.employee)}
        src={chatMessage.employee.avatar || undefined}
      />
      <div>
        <Text className={styles.name}>
          {getEmployeeFullName(chatMessage.employee)}
        </Text>
        <div
          className={[
            styles.left_section,
            chatMessage.type === 'image' && styles.image_section,
          ].join(' ')}
        >
          {chatMessage.type === 'image' ? (
            <ZoomableImage
              className={styles.image}
              src={chatMessage.message}
              alt="изображение"
            />
          ) : (
            <Linkify>{chatMessage.message}</Linkify>
          )}
          <Text
            className={styles.bottom_text}
          >{`${getEditedText} ${created}`}</Text>
        </div>
      </div>
    </div>
  );
};

export default MessengerMessageItemLeft;
