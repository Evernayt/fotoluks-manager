import { Row } from '@tanstack/react-table';
import { useAppDispatch } from 'hooks/redux';
import { IPosition } from 'models/api/moysklad/IPosition';
import { FC } from 'react';
import { modalActions } from 'store/reducers/ModalSlice';

interface SupplyNameCellProps {
  row: Row<IPosition>;
}

const SupplyNameCell: FC<SupplyNameCellProps> = ({ row }) => {
  const dispatch = useAppDispatch();

  const openEditProductModal = () => {
    dispatch(
      modalActions.openModal({
        modal: 'supplyEditProductModal',
        props: { position: row.original },
      })
    );
  };

  return (
    <div
      className="row_full cell_padding"
      style={{ cursor: 'pointer' }}
      onClick={openEditProductModal}
    >
      <b className="row_nowrap">
        {row.original.assortment?.article || row.original.assortment?.code}{' '}
      </b>
      {row.original.assortment?.name}
    </div>
  );
};

export default SupplyNameCell;
