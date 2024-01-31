import { IconButton, useToast } from '@chakra-ui/react';
import { IconPlus } from '@tabler/icons-react';
import { Row } from '@tanstack/react-table';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { getSuccessToast } from 'helpers/toast';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { ISupply } from 'models/api/moysklad/ISupply';
import { IDefectiveGood } from 'models/IDefectiveGood';
import { FC } from 'react';
import { defectiveGoodsActions } from 'store/reducers/DefectiveGoodsSlice';
import { v4 as uuidv4 } from 'uuid';

interface DefectiveGoodsAddCellProps {
  row: Row<ISupply>;
}

const DefectiveGoodsAddCell: FC<DefectiveGoodsAddCellProps> = ({ row }) => {
  const foundProduct = useAppSelector(
    (state) => state.defectiveGoods.foundProduct
  );
  const defectiveGoods = useAppSelector(
    (state) => state.defectiveGoods.defectiveGoods
  );

  const dispatch = useAppDispatch();
  const toast = useToast();

  const addDefectiveGoods = () => {
    if (!foundProduct) return;

    const supply = row.original;
    const defectiveGood: IDefectiveGood = {
      id: uuidv4(),
      agent: supply.agent,
      incomingNumber: supply.incomingNumber,
      assortment: foundProduct,
      quantity: 1,
    };

    const defectiveGoodDuplicate = defectiveGoods.find(
      (x) =>
        x.incomingNumber === defectiveGood.incomingNumber &&
        x.assortment.id === defectiveGood.assortment.id
    );

    if (!defectiveGoodDuplicate) {
      dispatch(defectiveGoodsActions.addDefectiveGood(defectiveGood));
      dispatch(defectiveGoodsActions.setLastDefectiveGood(defectiveGood));
    } else {
      dispatch(
        defectiveGoodsActions.setLastDefectiveGood(defectiveGoodDuplicate)
      );
    }

    toast(getSuccessToast('Добавлено'));
  };

  return (
    <IconButton
      icon={<IconPlus size={ICON_SIZE} stroke={ICON_STROKE} />}
      aria-label="add"
      variant="outline"
      isDisabled={!row.original.applicable}
      onClick={addDefectiveGoods}
    />
  );
};

export default DefectiveGoodsAddCell;
