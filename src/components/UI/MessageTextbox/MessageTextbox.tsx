import { IconSend } from 'icons';
import IconButton, { IconButtonVariants } from '../IconButton/IconButton';
import styles from './MessageTextbox.module.scss';
import {
  FC,
  useRef,
  useState,
  KeyboardEvent,
  ReactNode,
  useEffect,
  RefObject,
} from 'react';

export type onButtonClickProps = {
  text: string;
  setText: (v: string) => void;
};

interface MessageTextboxProps {
  initialText?: string;
  icon?: ReactNode;
  messageListRef?: RefObject<HTMLUListElement>;
  onButtonClick: (props: onButtonClickProps) => void;
}

const MessageTextbox: FC<MessageTextboxProps> = ({
  initialText = '',
  icon,
  messageListRef,
  onButtonClick,
}) => {
  const [text, setText] = useState<string>(initialText);

  const messageTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const messageTextAreaFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageListRef?.current) {
      messageListRef.current.scrollTop = messageListRef.current?.scrollHeight;
    }
  }, [messageTextAreaRef.current?.style.height]);

  const resizeTextArea = () => {
    if (messageTextAreaRef.current && messageTextAreaFrameRef.current) {
      messageTextAreaRef.current.style.height = '0px';
      const height = Math.min(100, messageTextAreaRef.current.scrollHeight);
      messageTextAreaFrameRef.current.style.height = `${height}px`;
      messageTextAreaRef.current.style.height = `${height}px`;
    }
  };

  const buttonClickAndResize = () => {
    setTimeout(() => {
      onButtonClick({ text, setText });
      if (messageTextAreaRef.current && messageTextAreaFrameRef.current) {
        messageTextAreaFrameRef.current.style.height = '17px';
        messageTextAreaRef.current.style.height = '17px';
        messageTextAreaRef.current.focus();
      }
    }, 0);
  };

  const autoResize = (event: KeyboardEvent) => {
    if (event.code === 'Enter' && !event.shiftKey) {
      buttonClickAndResize();
    } else {
      setTimeout(() => {
        resizeTextArea();
      }, 0);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.text_input_frame}
        ref={messageTextAreaFrameRef}
        onClick={() => messageTextAreaRef.current?.focus()}
      >
        <textarea
          className={styles.text_input}
          placeholder="Введите комментарий"
          ref={messageTextAreaRef}
          rows={1}
          value={text}
          onKeyDown={autoResize}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <IconButton
        className={styles.btn}
        variant={IconButtonVariants.link}
        icon={
          icon ? (
            icon
          ) : (
            <IconSend className={['link-icon', styles.send_icon].join(' ')} />
          )
        }
        circle
        onClick={buttonClickAndResize}
      />
    </div>
  );
};

export default MessageTextbox;
