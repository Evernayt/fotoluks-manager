import { NumberInput, NumberInputField } from '@chakra-ui/react';
import { Column, Row, Table } from '@tanstack/react-table';
import { IPosition } from 'models/api/moysklad/IPosition';
import { FC, useState } from 'react';

interface MoveQuantityCellProps {
  row: Row<IPosition>;
  column: Column<IPosition>;
  table: Table<IPosition>;
}

const MoveQuantityCell: FC<MoveQuantityCellProps> = ({
  row,
  column,
  table,
}) => {
  const [quantity, setQuantity] = useState<number>(row.original.quantity);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const changeHandler = (value: string) => {
    const intValue = Number(value);
    setQuantity((prevState) => (Number.isNaN(intValue) ? prevState : intValue));
  };

  const blurHandler = () => {
    if (row.original.quantity === quantity) return;

    setIsDisabled(true);
    table.options.meta
      //@ts-ignore
      ?.updateData(row.index, column.id, quantity)
      .finally(() => setIsDisabled(false));
  };

  return (
    <NumberInput
      value={quantity}
      min={0}
      isDisabled={isDisabled}
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

export default MoveQuantityCell;
