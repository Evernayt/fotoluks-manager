import { Row } from '@tanstack/react-table';
import { IPosition } from 'models/api/moysklad/IPosition';
import { FC } from 'react';

interface MoveNameCellProps {
  row: Row<IPosition>;
}

const MoveNameCell: FC<MoveNameCellProps> = ({ row }) => {
  return (
    <div className="row_full cell_padding">
      <b className="row_nowrap">{row.original.assortment?.code} </b>
      {row.original.assortment?.name}
    </div>
  );
};

export default MoveNameCell;
