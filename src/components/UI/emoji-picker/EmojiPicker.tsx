import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  useColorMode,
} from '@chakra-ui/react';
import { IconMoodSmile } from '@tabler/icons-react';
import { ICON_STROKE } from 'constants/app';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { FC } from 'react';
import { IEmoji } from './EmojiPicker.types';
import './EmojiPicker.scss';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: IEmoji) => void;
}

const EmojiPicker: FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const { colorMode } = useColorMode();

  return (
    <Popover placement="top-start" isLazy>
      <PopoverTrigger>
        <IconButton
          icon={<IconMoodSmile className="link-icon" stroke={ICON_STROKE} />}
          aria-label="emoji"
          variant="ghost"
          isRound
          size="lg"
        />
      </PopoverTrigger>
      <PopoverContent w="100%">
        <PopoverArrow />
        <Picker
          data={data}
          theme={colorMode}
          locale="ru"
          previewPosition="none"
          skinTonePosition="none"
          onEmojiSelect={onEmojiSelect}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
