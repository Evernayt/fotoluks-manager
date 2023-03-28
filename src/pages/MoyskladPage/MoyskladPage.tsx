import { Navmenu } from 'components';
import { getNotAvailableGoods, getOrderedGoods } from 'helpers/localStorage';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect } from 'react';
import { endingGoodsSlice } from 'store/reducers/EndingGoodsSlice';
import {
  EndingGoodsProductModal,
  EndingGoodsEditProductModal,
  EndingGoodsClearOrderedModal,
  UpdatePriceModal,
} from './Modals';
import styles from './MoyskladPage.module.scss';
import MoyskladSidemenu from './Sidemenu/MoyskladSidemenu';
import {
  MoyskladMovesTable,
  MoyskladEndingGoodsTable,
  MoyskladUpdatePrices,
} from './Tables';

const MoyskladPage = () => {
  const activeSidemenuIndex = useAppSelector(
    (state) => state.moysklad.activeSidemenuIndex
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    const localOrderedData = getOrderedGoods();
    dispatch(endingGoodsSlice.actions.setOrderedGoods(localOrderedData));

    const localAbsentData = getNotAvailableGoods();
    dispatch(endingGoodsSlice.actions.setNotAvailableGoods(localAbsentData));
  }, []);

  const renderTable = () => {
    switch (activeSidemenuIndex) {
      case 0:
        return <MoyskladMovesTable />;
      case 1:
        return <MoyskladEndingGoodsTable />;
      case 2:
        return <MoyskladUpdatePrices />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <EndingGoodsProductModal />
      <EndingGoodsEditProductModal />
      <EndingGoodsClearOrderedModal />
      <UpdatePriceModal />
      <Navmenu />
      <div className={styles.section}>
        <MoyskladSidemenu />
        <div className={styles.panel}>{renderTable()}</div>
      </div>
    </div>
  );
};

export default MoyskladPage;
