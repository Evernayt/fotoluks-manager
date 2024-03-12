import {
  Select as ChakraSelect,
  Props,
  ActionMeta,
  GetOptionLabel,
} from 'chakra-react-select';
import { useMemo } from 'react';
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
  getOptionValue?: (option: T) => number | string;
  isRightMenuPlacement?: boolean;
}

const Select = <T extends any>({
  isRightMenuPlacement,
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
      placeholder="Выберите..."
      variant="filled"
      isSearchable={false}
      {...props}
      chakraStyles={{
        container: (baseStyles) => ({
          ...baseStyles,
          cursor: 'pointer',
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
      value={defaultValue}
      defaultValue={defaultValue}
      onChange={onChangeHandler}
      onBlur={fieldProps.onBlur}
    />
  );
};

export default Select;
