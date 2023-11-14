import {
  ChangeEvent,
  FC,
  InputHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import { Column, Row } from 'react-table';
import Textbox from '../Textbox/Textbox';

export interface TableEditableNumCellProps {
  value: number;
  row: Row;
  column: Column;
  updateMyData: (
    index: number,
    id: string | undefined,
    value: number
  ) => Promise<any>;
  textboxProps?: InputHTMLAttributes<HTMLInputElement>;
}

const TableEditableNumCell: FC<TableEditableNumCellProps> = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
  textboxProps,
}) => {
  const [value, setValue] = useState<number>(initialValue);
  const [disabled, setDisabled] = useState<boolean>(false);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const onBlur = () => {
    setDisabled(true);
    updateMyData(index, id, value).finally(() => setDisabled(false));
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Textbox
      {...textboxProps}
      type="number"
      value={value}
      onChange={changeHandler}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
};

export default TableEditableNumCell;
