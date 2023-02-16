import TableEditableNumCell, {
  TableEditableNumCellProps,
} from 'components/UI/Table/TableEditableNumCell';
import { FC } from 'react';

const MoveDetailNumCell: FC<TableEditableNumCellProps> = ({
  value,
  row,
  column,
  updateMyData,
}) => {
  return (
    <TableEditableNumCell
      value={value}
      row={row}
      column={column}
      updateMyData={updateMyData}
      textboxProps={{ min: 1 }}
    />
  );
};

export default MoveDetailNumCell;
