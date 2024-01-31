import { Tooltip } from '@chakra-ui/react';
import { IconMessageQuestion } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { FC } from 'react';

interface OrderInfoReasonCellProps {
  description: string;
}

const OrderInfoReasonCell: FC<OrderInfoReasonCellProps> = ({ description }) => {
  return description ? (
    <Tooltip label={`— Причина отмены —\n${description}`} whiteSpace="pre-line">
      <IconMessageQuestion
        className="link-icon"
        size={ICON_SIZE}
        stroke={ICON_STROKE}
      />
    </Tooltip>
  ) : null;
};

export default OrderInfoReasonCell;
