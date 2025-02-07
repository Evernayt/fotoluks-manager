import { mask as masker, unMask } from 'node-masker';
import { Input, InputProps } from '@chakra-ui/react';
import { FC } from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';

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

interface MaskedInputFormFieldProps extends Omit<InputProps, 'onChange'> {
  control: Control<any, any>;
  name: string;
  rules?: RegisterOptions;
  mask?: string;
  onChange?: (value: string) => void;
}

export const MaskedInputFormField = ({
  control,
  name,
  rules,
  ...props
}: MaskedInputFormFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <MaskedInput
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          {...props}
        />
      )}
    />
  );
};

export default MaskedInput;
