import { IconButton, Tooltip } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconPlus } from 'icons';
import { ISupply } from 'models/api/moysklad/ISupply';
import { IDefectiveGood } from 'models/IDefectiveGood';
import { useState } from 'react';
import { Cell } from 'react-table';
import { defectiveGoodsSlice } from 'store/reducers/DefectiveGoodsSlice';
import { v4 as uuidv4 } from 'uuid';

const DefectiveGoodsAddCell = ({ row }: Cell<ISupply>) => {
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const foundProduct = useAppSelector(
    (state) => state.defectiveGoods.foundProduct
  );
  const defectiveGoods = useAppSelector(
    (state) => state.defectiveGoods.defectiveGoods
  );

  const dispatch = useAppDispatch();

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
      dispatch(defectiveGoodsSlice.actions.addDefectiveGood(defectiveGood));
      dispatch(defectiveGoodsSlice.actions.setLastDefectiveGood(defectiveGood));

      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 500);
    } else {
      dispatch(
        defectiveGoodsSlice.actions.setLastDefectiveGood(defectiveGoodDuplicate)
      );
    }
  };

  return (
    <Tooltip label="Добавлено" disabled={!isAdded} delay={0}>
      <div>
        <IconButton icon={<IconPlus />} onClick={addDefectiveGoods} />
      </div>
    </Tooltip>
  );
};

export default DefectiveGoodsAddCell;
