import { NumberInput, NumberInputField } from '@chakra-ui/react';
import { Column, Row, Table } from '@tanstack/react-table';
import { IPosition } from 'models/api/moysklad/IPosition';
import { FC, useEffect, useState } from 'react';

interface SupplyPriceCellProps {
  row: Row<IPosition>;
  column: Column<IPosition>;
  table: Table<IPosition>;
}

const SupplyPriceCell: FC<SupplyPriceCellProps> = ({ row, column, table }) => {
  const currentPrice = (row.original.price || 0) / 100;
  const initialValue = (Math.round(currentPrice * 10000) / 10000).toString();

  const [price, setPrice] = useState<string>(initialValue);
  const [priceValue, setPriceValue] = useState<number>(row.original.price || 0);

  useEffect(() => {
    setPrice(initialValue);
    setPriceValue(row.original.price || 0);
  }, [initialValue]);

  const changeHandler = (value: string) => {
    setPrice(value);
    const intValue = Number(value);
    setPriceValue(intValue * 100);
  };

  const blurHandler = () => {
    if (initialValue === price) return;
    table.options.meta
      //@ts-ignore
      ?.updateData(row.index, column.id, {
        ...row.original,
        price: priceValue,
      });
  };

  return (
    <NumberInput
      value={price}
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

export default SupplyPriceCell;
