import { Row } from '@tanstack/react-table';
import { CopyWrapper } from 'components';
import { NOT_INDICATED } from 'constants/app';
import { IOrder } from 'models/api/IOrder';
import { mask } from 'node-masker';
import { FC } from 'react';

interface OrderPhoneCellProps {
  row: Row<IOrder>;
}

const OrderPhoneCell: FC<OrderPhoneCellProps> = ({ row }) => {
  return (
    <>
      {row.original.user ? (
        <div className="cell_padding">
          <CopyWrapper className="row_nowrap" text={row.original.user.phone}>
            {mask(row.original.user.phone, '8 (999) 999-99-99')}
          </CopyWrapper>
        </div>
      ) : (
        NOT_INDICATED
      )}
    </>
  );
};

export default OrderPhoneCell;
