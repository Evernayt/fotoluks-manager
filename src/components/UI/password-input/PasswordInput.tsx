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
import { Control, Controller, RegisterOptions } from 'react-hook-form';

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

interface PasswordInputFormFieldProps extends InputProps {
  control: Control<any, any>;
  name: string;
  rules?: RegisterOptions;
}

export const PasswordInputFormField = ({
  control,
  name,
  rules,
  ...props
}: PasswordInputFormFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <PasswordInput
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          {...props}
        />
      )}
    />
  );
};

export default PasswordInput;
