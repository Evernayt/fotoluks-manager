import {
  AsyncSelect as ChakraAsyncSelect,
  AsyncProps,
} from 'chakra-react-select';
import ClearIndicator from './clear-indicator/ClearIndicator';
import { Control, Controller, RegisterOptions } from 'react-hook-form';

export const AsyncSelect = ({ ...props }) => {
  const getOptionLabelHandler = (option: any) => {
    const { getOptionLabel } = props;
    return getOptionLabel ? getOptionLabel(option) : option.label;
  };

  const getOptionValueHandler = (option: any) => {
    const { getOptionValue } = props;
    return getOptionValue ? getOptionValue(option) : option.value;
  };

  return (
    <ChakraAsyncSelect
      selectedOptionStyle="check"
      noOptionsMessage={() => 'Пусто'}
      loadingMessage={() => 'Загрузка...'}
      components={{ ClearIndicator }}
      placeholder="Выберите..."
      variant="filled"
      isSearchable
      {...props}
      chakraStyles={{
        container: (baseStyles) => ({
          ...baseStyles,
          cursor: 'text',
        }),
        dropdownIndicator: (baseStyles) => ({
          ...baseStyles,
          p: 0,
          pr: '14px',
          bg: 'transparent',
        }),
        option: (baseStyles) => ({
          ...baseStyles,
          whiteSpace: 'nowrap',
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          minW: 'max-content',
        }),
        valueContainer: (baseStyles) => ({
          ...baseStyles,
          pr: props.isClearable ? 0 : '14px',
        }),
      }}
      getOptionLabel={getOptionLabelHandler}
      getOptionValue={getOptionValueHandler}
    />
  );
};

interface AsyncSelectFormFieldProps extends AsyncProps<any, any, any> {
  control: Control<any, any>;
  name: string;
  rules?: RegisterOptions;
}

export const AsyncSelectFormField = ({
  control,
  name,
  rules,
  ...props
}: AsyncSelectFormFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <AsyncSelect
          {...props}
          value={value}
          isSearchable
          isClearable
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
};

export default AsyncSelect;
