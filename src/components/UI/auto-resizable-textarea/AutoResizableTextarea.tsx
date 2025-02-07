import { Textarea, TextareaProps } from '@chakra-ui/react';
import { FC, useLayoutEffect, useRef } from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';

const TEXTAREA_PADDING = 14;

const AutoResizableTextarea: FC<TextareaProps> = ({ ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'inherit';
    textareaRef.current.style.height = `${Math.max(
      textareaRef.current.scrollHeight + TEXTAREA_PADDING,
      35.25
    )}px`;
  }, [props.value]);

  return (
    <Textarea
      {...props}
      ref={textareaRef}
      rows={1}
      resize="none"
      minH="35.25px"
    />
  );
};

interface AutoResizableTextareaFormFieldProps extends TextareaProps {
  control: Control<any, any>;
  name: string;
  rules?: RegisterOptions;
}

export const AutoResizableTextareaFormField = ({
  control,
  name,
  rules,
  ...props
}: AutoResizableTextareaFormFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <AutoResizableTextarea
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          {...props}
        />
      )}
    />
  );
};

export default AutoResizableTextarea;
