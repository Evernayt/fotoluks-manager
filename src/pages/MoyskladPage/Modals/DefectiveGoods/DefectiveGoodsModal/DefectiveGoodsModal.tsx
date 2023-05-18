import { Button, Modal } from 'components';
import { groupBy } from 'helpers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IDefectiveGood } from 'models/IDefectiveGood';
import { useMemo } from 'react';
import { defectiveGoodsSlice } from 'store/reducers/DefectiveGoodsSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './DefectiveGoodsModal.module.scss';
import DefectiveGoodsProduct from './DefectiveGoodsProduct/DefectiveGoodsProduct';

const DefectiveGoodsModal = () => {
  const defectiveGoodsModal = useAppSelector(
    (state) => state.modal.defectiveGoodsModal
  );
  const defectiveGoods = useAppSelector(
    (state) => state.defectiveGoods.defectiveGoods
  );

  const dispatch = useAppDispatch();

  const groupedDefectiveGoods = useMemo<IDefectiveGood[][]>(
    () => groupBy(defectiveGoods, 'incomingNumber'),
    [defectiveGoods]
  );

  const removeAll = () => {
    dispatch(defectiveGoodsSlice.actions.removeAll());
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('defectiveGoodsModal'));
    dispatch(defectiveGoodsSlice.actions.setLastDefectiveGood(null));
  };

  return (
    <Modal
      title="Товары на возврат"
      isShowing={defectiveGoodsModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        {groupedDefectiveGoods.length ? (
          <>
            <div className={styles.defective_goods_container}>
              {groupedDefectiveGoods.map((defectiveGoods) => (
                <div key={defectiveGoods[0].incomingNumber}>
                  <div className={styles.group}>
                    <b>{defectiveGoods[0].agent.name}</b>
                    <div>{defectiveGoods[0].incomingNumber}</div>
                  </div>

                  <div className={styles.products_container}>
                    {defectiveGoods.map((defectiveGood) => (
                      <DefectiveGoodsProduct
                        defectiveGood={defectiveGood}
                        key={defectiveGood.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={removeAll}>Очистить</Button>
          </>
        ) : (
          <div className={styles.message}>Ничего не добавлено</div>
        )}
      </div>
    </Modal>
  );
};

export default DefectiveGoodsModal;
