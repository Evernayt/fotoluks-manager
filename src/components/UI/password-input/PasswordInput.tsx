import {
  Input,
  InputGroup,
  InputRightElement,
  InputProps,
  IconButton,
} from '@chakra-ui/react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { FC, useState } from 'react';

const PasswordInput: FC<InputProps> = ({ ...props }) => {
  const [isShowing, setIsShowing] = useState<boolean>(false);

  const showToggle = () => {
    setIsShowing((prevState) => !prevState);
  };

  return (
    <InputGroup>
      <Input
        placeholder="Пароль"
        {...props}
        type={isShowing ? 'text' : 'password'}
      />
      <InputRightElement>
        <IconButton
          icon={
            isShowing ? (
              <IconEyeOff size={ICON_SIZE} stroke={ICON_STROKE} />
            ) : (
              <IconEye size={ICON_SIZE} stroke={ICON_STROKE} />
            )
          }
          aria-label="password"
          variant="ghost"
          size="sm"
          onClick={showToggle}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
