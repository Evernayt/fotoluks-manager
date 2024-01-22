import { mask as masker, unMask } from 'node-masker';
import { Input, InputProps } from '@chakra-ui/react';
import { FC } from 'react';

interface MaskedInputProps extends Omit<InputProps, 'onChange'> {
  value: string;
  mask?: string;
  onChange: (value: string) => void;
}

const MaskedInput: FC<MaskedInputProps> = ({
  value,
  mask = '8 (999) 999-99-99',
  onChange,
  ...props
}) => {
  const onChangeHandler = (target: HTMLInputElement) => {
    if (target.value.length <= mask.length) {
      onChange(unMask(target.value));
    }
  };

  return (
    <Input
      {...props}
      value={masker(value, mask)}
      onChange={({ target }) => onChangeHandler(target)}
    />
  );
};

export default MaskedInput;
