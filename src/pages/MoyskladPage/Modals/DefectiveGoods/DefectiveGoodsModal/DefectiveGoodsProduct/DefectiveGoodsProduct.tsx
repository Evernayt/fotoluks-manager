import { IconButton, Textbox } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IconTrash } from 'icons';
import { IDefectiveGood } from 'models/IDefectiveGood';
import { FC } from 'react';
import { defectiveGoodsSlice } from 'store/reducers/DefectiveGoodsSlice';
import styles from './DefectiveGoodsProduct.module.scss';

interface DefectiveGoodsProductProps {
  defectiveGood: IDefectiveGood;
}

const DefectiveGoodsProduct: FC<DefectiveGoodsProductProps> = ({
  defectiveGood,
}) => {
  const lastDefectiveGood = useAppSelector(
    (state) => state.defectiveGoods.lastDefectiveGood
  );

  const dispatch = useAppDispatch();

  const setQuantity = (quantity: number) => {
    dispatch(
      defectiveGoodsSlice.actions.setQuantity({
        id: defectiveGood.id,
        quantity,
      })
    );
  };

  const remove = () => {
    dispatch(defectiveGoodsSlice.actions.remove(defectiveGood.id));
  };

  return (
    <div
      className={[
        styles.container,
        lastDefectiveGood?.id === defectiveGood.id && styles.last,
      ].join(' ')}
    >
      <b>{defectiveGood.assortment.article}</b>
      <div className={styles.name}>{defectiveGood.assortment.name}</div>
      <Textbox
        containerClassName={styles.quantity}
        type="number"
        min={0}
        value={defectiveGood.quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <IconButton icon={<IconTrash />} onClick={remove} />
    </div>
  );
};

export default DefectiveGoodsProduct;
