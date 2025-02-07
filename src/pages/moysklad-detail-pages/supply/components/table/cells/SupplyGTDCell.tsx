import { Input } from '@chakra-ui/react';
import { Column, Row, Table } from '@tanstack/react-table';
import { IPosition } from 'models/api/moysklad/IPosition';
import { FC, useEffect, useState } from 'react';

interface SupplyGTDCellProps {
  row: Row<IPosition>;
  column: Column<IPosition>;
  table: Table<IPosition>;
}

const SupplyGTDCell: FC<SupplyGTDCellProps> = ({ row, column, table }) => {
  const initialValue = row.original.gtd?.name || '';

  const [gtd, setGtd] = useState<string>(initialValue);

  useEffect(() => {
    setGtd(initialValue);
  }, [initialValue]);

  const changeHandler = (value: string) => {
    setGtd(value);
  };

  const blurHandler = () => {
    if (initialValue === gtd) return;
    table.options.meta
      //@ts-ignore
      ?.updateData(row.index, column.id, {
        ...row.original,
        gtd: { name: gtd },
      });
  };

  return (
    <Input
      value={gtd}
      onChange={(e) => changeHandler(e.target.value)}
      onBlur={blurHandler}
      w="100px"
      fontSize="var(--table-font-size)"
      border="none"
      h="auto"
      py="2px"
    />
  );
};

export default SupplyGTDCell;
