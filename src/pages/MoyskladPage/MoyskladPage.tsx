import { Navmenu } from 'components';
import { getNotAvailableGoods, getOrderedGoods } from 'helpers/localStorage';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect } from 'react';
import { endingGoodsSlice } from 'store/reducers/EndingGoodsSlice';
import {
  EndingGoodsProductModal,
  EndingGoodsEditProductModal,
  EndingGoodsClearOrderedModal,
} from './Modals';
import styles from './MoyskladPage.module.scss';
import MoyskladSidemenu from './Sidemenu/MoyskladSidemenu';
import { MoyskladMovesTable, MoyskladEndingGoodsTable } from './Tables';

const MoyskladPage = () => {
  const activeTableId = useAppSelector((state) => state.moysklad.activeTableId);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const localOrderedData = getOrderedGoods();
    dispatch(endingGoodsSlice.actions.setOrderedGoods(localOrderedData));

    const localAbsentData = getNotAvailableGoods();
    dispatch(endingGoodsSlice.actions.setNotAvailableGoods(localAbsentData));
  }, []);

  const renderTable = () => {
    switch (activeTableId) {
      case 1:
        return <MoyskladMovesTable />;
      case 2:
        return <MoyskladEndingGoodsTable />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <EndingGoodsProductModal />
      <EndingGoodsEditProductModal />
      <EndingGoodsClearOrderedModal />
      <Navmenu />
      <div className={styles.section}>
        <MoyskladSidemenu />
        <div className={styles.panel}>{renderTable()}</div>
      </div>
    </div>
  );
};

export default MoyskladPage;
