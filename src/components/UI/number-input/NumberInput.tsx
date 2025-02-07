import {
  NumberInput,
  NumberInputField,
  NumberInputProps,
} from '@chakra-ui/react';
import { Controller, Control, RegisterOptions } from 'react-hook-form';

interface NumberInputFormFieldProps extends NumberInputProps {
  control: Control<any, any>;
  name: string;
  rules?: RegisterOptions;
}

export const NumberInputFormField = ({
  control,
  name,
  rules,
  ...props
}: NumberInputFormFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <NumberInput
          {...props}
          value={value}
          isSearchable
          isClearable
          onChange={onChange}
          onBlur={onBlur}
        >
          <NumberInputField />
        </NumberInput>
      )}
    />
  );
};
