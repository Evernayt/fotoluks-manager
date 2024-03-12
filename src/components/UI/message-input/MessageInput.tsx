import { IconButton, Textarea, TextareaProps } from '@chakra-ui/react';
import {
  FC,
  ReactElement,
  useLayoutEffect,
  useRef,
  KeyboardEvent,
} from 'react';
import { IconSend } from '@tabler/icons-react';
import { ICON_STROKE } from 'constants/app';
import styles from './MessageInput.module.scss';

interface MessageInputProps extends TextareaProps {
  icon?: ReactElement;
  onButtonClick: () => void;
}

const MessageInput: FC<MessageInputProps> = ({
  icon,
  onButtonClick,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'inherit';
    textareaRef.current.style.height = `${Math.min(
      100,
      textareaRef.current.scrollHeight + 4
    )}px`;
  }, [props.value]);

  const buttonClickAndResize = () => {
    setTimeout(() => {
      onButtonClick();
      if (textareaRef.current) {
        textareaRef.current.style.height = 'inherit';
        textareaRef.current.focus();
      }
    }, 0);
  };

  const enterKeyHandler = (event: KeyboardEvent) => {
    if (event.code === 'Enter' && !event.shiftKey) {
      buttonClickAndResize();
    }
  };

  return (
    <div className={styles.container}>
      <Textarea
        placeholder="Введите комментарий"
        {...props}
        ref={textareaRef}
        variant="filled"
        rows={1}
        resize="none"
        minH="42px"
        py="9.6px"
        onKeyDown={enterKeyHandler}
      />
      <IconButton
        className={styles.btn}
        variant="ghost"
        size="lg"
        icon={
          icon ? (
            icon
          ) : (
            <IconSend
              className={['link-icon', styles.send_icon].join(' ')}
              stroke={ICON_STROKE}
            />
          )
        }
        aria-label="button"
        isRound
        onClick={buttonClickAndResize}
      />
    </div>
  );
};

export default MessageInput;
