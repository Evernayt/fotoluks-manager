import { Card } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import MoyskladSidebar from './components/ControlSidebar';
import StocksTable from './components/tables/stocks/StocksTable';
import EndingGoodsProductModal from './modals/ending-goods/product-modal/EndingGoodsProductModal';
import { lazy, useEffect } from 'react';
import {
  getDefectiveGoods,
  getNotAvailableGoods,
  getOrderedGoods,
} from 'helpers/localStorage';
import { endingGoodsActions } from 'store/reducers/EndingGoodsSlice';
import UpdatePricesModal from './modals/update-prices/update-prices-modal/UpdatePricesModal';
import { defectiveGoodsActions } from 'store/reducers/DefectiveGoodsSlice';
import DefectiveGoodsForReturnModal from './modals/defective-goods/for-return-modal/DefectiveGoodsForReturnModal';
import styles from './MoyskladPage.module.scss';

const MovesTable = lazy(() => import('./components/tables/moves/MovesTable'));
const EndingGoodsTable = lazy(
  () => import('./components/tables/ending-goods/EndingGoodsTable')
);
const UpdatePricesTable = lazy(
  () => import('./components/tables/update-prices/UpdatePricesTable')
);
const DefectiveGoodsTable = lazy(
  () => import('./components/tables/defective-goods/DefectiveGoodsTable')
);

const MoyskladPage = () => {
  const activeSidebarIndex = useAppSelector(
    (state) => state.moysklad.activeSidebarIndex
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    loadEndingGoodsLocalData();
    loadDefectiveGoodsLocalData();
  }, []);

  const loadEndingGoodsLocalData = () => {
    const localOrderedData = getOrderedGoods();
    dispatch(endingGoodsActions.setOrderedGoods(localOrderedData));

    const localAbsentData = getNotAvailableGoods();
    dispatch(endingGoodsActions.setNotAvailableGoods(localAbsentData));
  };

  const loadDefectiveGoodsLocalData = () => {
    const localDefectiveGoods = getDefectiveGoods();
    dispatch(defectiveGoodsActions.setDefectiveGoods(localDefectiveGoods));
  };

  const renderTable = () => {
    switch (activeSidebarIndex) {
      case 0:
        return <StocksTable />;
      case 1:
        return <MovesTable />;
      case 2:
        return <EndingGoodsTable />;
      case 3:
        return <UpdatePricesTable />;
      case 4:
        return <DefectiveGoodsTable />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <UpdatePricesModal />
      <EndingGoodsProductModal />
      <DefectiveGoodsForReturnModal />
      <MoyskladSidebar />
      <Card className={styles.panel}>{renderTable()}</Card>
    </div>
  );
};

export default MoyskladPage;
