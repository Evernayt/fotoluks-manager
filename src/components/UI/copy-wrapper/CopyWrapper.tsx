import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

interface CopyWrapperProps {
  text: string;
  children: ReactNode;
  className?: string;
}

const CopyWrapper: FC<CopyWrapperProps> = ({ text, children, className }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const copyHandler = () => {
    navigator.clipboard.writeText(text).then(() => {
      setTimeout(onClose, 500);
    });
  };

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <div
          className={className}
          style={{ cursor: 'pointer', width: 'max-content' }}
          onClick={copyHandler}
        >
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent w="max-content">
        <PopoverArrow />
        <PopoverBody>Скопировано</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default CopyWrapper;
