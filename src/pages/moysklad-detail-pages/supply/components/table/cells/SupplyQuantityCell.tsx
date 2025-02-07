import { NumberInput, NumberInputField } from '@chakra-ui/react';
import { Column, Row, Table } from '@tanstack/react-table';
import { IPosition } from 'models/api/moysklad/IPosition';
import { FC, useEffect, useState } from 'react';

interface SupplyQuantityCellProps {
  row: Row<IPosition>;
  column: Column<IPosition>;
  table: Table<IPosition>;
}

const SupplyQuantityCell: FC<SupplyQuantityCellProps> = ({
  row,
  column,
  table,
}) => {
  const initialValue = row.original.quantity;

  const [quantity, setQuantity] = useState<number>(initialValue);

  useEffect(() => {
    setQuantity(initialValue);
  }, [initialValue]);

  const changeHandler = (value: string) => {
    const intValue = Number(value);
    setQuantity((prevState) => (Number.isNaN(intValue) ? prevState : intValue));
  };

  const blurHandler = () => {
    if (row.original.quantity === quantity) return;
    table.options.meta
      //@ts-ignore
      ?.updateData(row.index, column.id, { ...row.original, quantity });
  };

  return (
    <NumberInput
      value={quantity}
      min={0}
      onChange={changeHandler}
      onBlur={blurHandler}
      w="100px"
    >
      <NumberInputField
        fontSize="var(--table-font-size)"
        border="none"
        h="auto"
        py="2px"
      />
    </NumberInput>
  );
};

export default SupplyQuantityCell;
