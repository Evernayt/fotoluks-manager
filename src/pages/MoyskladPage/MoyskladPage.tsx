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
import MoyskladSearch from './Search/MoyskladSearch';
import MoyskladSidemenu from './Sidemenu/MoyskladSidemenu';
import {
  MoyskladMovesTable,
  MoyskladEndingGoodsTable,
  MoyskladUpdatePrices,
  MoyskladStocks,
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
        return <MoyskladStocks />;
      case 1:
        return <MoyskladMovesTable />;
      case 2:
        return <MoyskladEndingGoodsTable />;
      case 3:
        return <MoyskladUpdatePrices />;
      default:
        return null;
    }
  };

  const renderSearch = () => {
    switch (activeSidemenuIndex) {
      case 0:
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
      <Navmenu searchRender={renderSearch} />
      <div className={styles.section}>
        <MoyskladSidemenu />
        <div className={styles.panel}>{renderTable()}</div>
      </div>
    </div>
  );
};

export default MoyskladPage;
