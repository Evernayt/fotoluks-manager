import {
  Select as ChakraSelect,
  Props,
  ActionMeta,
  GetOptionLabel,
} from 'chakra-react-select';
import { CSSProperties, useMemo } from 'react';
import ClearIndicator from './clear-indicator/ClearIndicator';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { FieldInputProps, FormikProps } from 'formik';

export interface ISelectOption<T = number> {
  label: string;
  value: T;
}

interface SelectProps<T extends any>
  extends Omit<Props, 'onChange' | 'getOptionLabel' | 'getOptionValue'> {
  options?: T[];
  onChange?: (option: T, action: ActionMeta<T>) => void;
  getOptionLabel?: GetOptionLabel<T>;
  getOptionValue?: (option: T) => any;
  isRightMenuPlacement?: boolean;
  containerStyles?: CSSProperties;
  dropdownIndicatorStyles?: CSSProperties;
}

const Select = <T extends any>({
  isRightMenuPlacement,
  containerStyles,
  dropdownIndicatorStyles,
  ...props
}: SelectProps<T>) => {
  const onChangeHandler = (option: any, action: ActionMeta<any>) => {
    if (props.onChange) props.onChange(option, action);
  };

  const getOptionLabelHandler = (option: any) => {
    const { getOptionLabel } = props;
    return getOptionLabel ? getOptionLabel(option) : option.label;
  };

  const getOptionValueHandler = (option: any) => {
    const { getOptionValue } = props;
    return getOptionValue ? getOptionValue(option) : option.value;
  };

  return (
    <ChakraSelect
      selectedOptionStyle="check"
      noOptionsMessage={() => 'Пусто'}
      loadingMessage={() => 'Загрузка...'}
      components={{ ClearIndicator }}
      placeholder="Выберите..."
      variant="filled"
      isSearchable={false}
      {...props}
      chakraStyles={{
        container: (baseStyles) => ({
          ...baseStyles,
          cursor: props.isSearchable ? 'text' : 'pointer',
          ...containerStyles,
        }),
        dropdownIndicator: (baseStyles) => ({
          ...baseStyles,
          p: 0,
          pr: '14px',
          bg: 'transparent',
          ...dropdownIndicatorStyles,
        }),
        option: (baseStyles) => ({
          ...baseStyles,
          whiteSpace: 'nowrap',
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          minW: 'max-content',
          right: isRightMenuPlacement ? 0 : 'auto',
        }),
      }}
      onChange={onChangeHandler}
      getOptionLabel={getOptionLabelHandler}
      getOptionValue={getOptionValueHandler}
    />
  );
};

interface SelectFieldProps<T extends any> extends SelectProps<T> {
  fieldProps: FieldInputProps<any>;
  formProps: FormikProps<any>;
}

export const SelectField = <T extends any>({
  fieldProps,
  formProps,
  ...props
}: SelectFieldProps<T>) => {
  const defaultValue = useMemo(() => {
    const { options, getOptionValue } = props;
    if (!options) return null;
    if (props.isMulti) {
      return fieldProps.value;
    } else {
      if (getOptionValue) {
        return options.find(
          (option: any) => getOptionValue(option) == fieldProps.value
        );
      } else {
        return options.find((option: any) => option.value == fieldProps.value);
      }
    }
  }, [fieldProps.value, props.options]);

  const onChangeHandler = (option: any, action: ActionMeta<any>) => {
    const { getOptionValue } = props;
    if (props.isMulti) {
      formProps.setFieldValue(fieldProps.name, option);
    } else {
      formProps.setFieldValue(
        fieldProps.name,
        getOptionValue ? getOptionValue(option) : option.value
      );
    }

    if (props.onChange) props.onChange(option, action);
  };

  return (
    <Select
      {...props}
      name={fieldProps.name}
      value={defaultValue || props.defaultValue}
      defaultValue={defaultValue}
      onChange={onChangeHandler}
      onBlur={fieldProps.onBlur}
    />
  );
};

interface SelectFormFieldProps<T extends any> extends SelectProps<T> {
  control: Control<any, any>;
  name: string;
  rules?: RegisterOptions;
}

export const SelectFormField = <T extends any>({
  control,
  name,
  rules,
  ...props
}: SelectFormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <Select
          {...props}
          value={value}
          defaultValue={value}
          isClearable
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
};

export default Select;
