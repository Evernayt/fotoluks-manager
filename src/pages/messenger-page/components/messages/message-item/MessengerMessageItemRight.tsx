import { UI_DATE_FORMAT } from 'constants/app';
import moment from 'moment';
import { FC } from 'react';
import { Linkify, ZoomableImage } from 'components';
import { useContextMenu } from 'react-contexify';
import { MESSENGER_MESSAGE_MENU_ID } from '../context-menu/MessengerMessageContextMenu';
import { Text } from '@chakra-ui/react';
import { IChatMessage } from 'models/api/IChatMessage';
import styles from './MessengerMessageItem.module.scss';

interface MessengerMessageItemProps {
  chatMessage: IChatMessage;
  className?: string;
}

const MessengerMessageItemRight: FC<MessengerMessageItemProps> = ({
  chatMessage,
  className,
}) => {
  const created = moment(chatMessage.createdAt).format(UI_DATE_FORMAT);

  const { show } = useContextMenu({ id: MESSENGER_MESSAGE_MENU_ID });

  const handleContextMenu = (event: any) => {
    show({ event, props: { chatMessage, isLeftItem: false } });
  };

  const getEditedText = chatMessage.edited ? '(изменено)' : '';

  return (
    <div
      className={[styles.container, styles.right_container].join(' ')}
      onContextMenu={handleContextMenu}
    >
      <div
        className={[
          styles.right_section,
          className,
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
  );
};

export default MessengerMessageItemRight;
