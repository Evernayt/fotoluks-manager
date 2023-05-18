import { getDateDiffDays } from 'helpers';
import { ISupply } from 'models/api/moysklad/ISupply';
import { Cell } from 'react-table';
import styles from './DefectiveGoodsStatusCell.module.scss';

const isReturnPossible = (incomingDate: string | undefined) => {
  if (incomingDate) {
    const days = getDateDiffDays(incomingDate);

    if (days > 60) {
      return { text: 'Нельзя вернуть', isCanReturn: false };
    } else {
      return { text: 'Можно вернуть', isCanReturn: true };
    }
  } else {
    return { text: '', isCanReturn: false };
  }
};

const DefectiveGoodsStatusCell = ({ row }: Cell<ISupply>) => {
  const { text, isCanReturn } = isReturnPossible(row.original.incomingDate);

  return (
    <div
      className={isCanReturn ? styles.can_returned : styles.can_not_returned}
    >
      {text}
    </div>
  );
};

export default DefectiveGoodsStatusCell;
