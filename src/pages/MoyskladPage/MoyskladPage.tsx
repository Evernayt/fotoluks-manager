import { Navmenu } from 'components';
import {
  getDefectiveGoods,
  getNotAvailableGoods,
  getOrderedGoods,
  setDefectiveGoods,
} from 'helpers/localStorage';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect } from 'react';
import { defectiveGoodsSlice } from 'store/reducers/DefectiveGoodsSlice';
import { endingGoodsSlice } from 'store/reducers/EndingGoodsSlice';
import {
  EndingGoodsProductModal,
  EndingGoodsEditProductModal,
  EndingGoodsClearOrderedModal,
  UpdatePriceModal,
  DefectiveGoodsModal,
} from './Modals';
import styles from './MoyskladPage.module.scss';
import MoyskladSearch from './Search/MoyskladSearch';
import MoyskladSidemenu from './Sidemenu/MoyskladSidemenu';
import {
  MoyskladMovesTable,
  MoyskladEndingGoodsTable,
  MoyskladUpdatePrices,
  MoyskladStocks,
  MoyskladDefectiveGoodsTable,
} from './Tables';

const MoyskladPage = () => {
  const activeSidemenuIndex = useAppSelector(
    (state) => state.moysklad.activeSidemenuIndex
  );
  const defectiveGoods = useAppSelector(
    (state) => state.defectiveGoods.defectiveGoods
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    loadEndingGoodsLocalData();
    loadDefectiveGoodsLocalData();
  }, []);

  useEffect(() => {
    setDefectiveGoods(defectiveGoods);
  }, [defectiveGoods]);

  const loadEndingGoodsLocalData = () => {
    const localOrderedData = getOrderedGoods();
    dispatch(endingGoodsSlice.actions.setOrderedGoods(localOrderedData));

    const localAbsentData = getNotAvailableGoods();
    dispatch(endingGoodsSlice.actions.setNotAvailableGoods(localAbsentData));
  };

  const loadDefectiveGoodsLocalData = () => {
    const localDefectiveGoods = getDefectiveGoods();
    dispatch(
      defectiveGoodsSlice.actions.setDefectiveGoods(localDefectiveGoods)
    );
  };

  const renderTable = () => {
    switch (activeSidemenuIndex) {
      case 0:
        return <MoyskladStocks />;
      case 1:
        return <MoyskladMovesTable />;
      case 2:
        return <MoyskladEndingGoodsTable />;
      case 3:
        return <MoyskladUpdatePrices />;
      case 4:
        return <MoyskladDefectiveGoodsTable />;
      default:
        return null;
    }
  };

  const renderSearch = () => {
    switch (activeSidemenuIndex) {
      case 0:
        return <MoyskladSearch />;
      case 4:
        return <MoyskladSearch />;
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
      <DefectiveGoodsModal />
      <Navmenu searchRender={renderSearch} />
      <div className={styles.section}>
        <MoyskladSidemenu />
        <div className={styles.panel}>{renderTable()}</div>
      </div>
    </div>
  );
};

export default MoyskladPage;
