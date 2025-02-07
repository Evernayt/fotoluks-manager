import { NumberInput, NumberInputField } from '@chakra-ui/react';
import { Column, Row, Table } from '@tanstack/react-table';
import { IPosition } from 'models/api/moysklad/IPosition';
import { FC, useEffect, useState } from 'react';

interface SupplyPriceSumCellProps {
  row: Row<IPosition>;
  column: Column<IPosition>;
  table: Table<IPosition>;
}

const SupplyPriceSumCell: FC<SupplyPriceSumCellProps> = ({
  row,
  column,
  table,
}) => {
  const currentPriceSum =
    ((row.original.price || 0) / 100) * row.original.quantity;
  const initialValue = (Math.round(currentPriceSum * 100) / 100).toString();

  const [priceSum, setPriceSum] = useState<string>(initialValue);
  const [priceValue, setPriceValue] = useState<number>(
    (row.original.price || 0) / row.original.quantity
  );

  useEffect(() => {
    setPriceSum(initialValue);
    setPriceValue((row.original.price || 0) / row.original.quantity);
  }, [initialValue]);

  const changeHandler = (value: string) => {
    setPriceSum(value);
    const intValue = Number(value);
    setPriceValue((intValue / row.original.quantity) * 100);
  };

  const blurHandler = () => {
    if (initialValue === priceSum) return;
    table.options.meta
      //@ts-ignore
      ?.updateData(row.index, column.id, {
        ...row.original,
        price: priceValue,
      });
  };

  return (
    <NumberInput
      value={priceSum}
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

export default SupplyPriceSumCell;
