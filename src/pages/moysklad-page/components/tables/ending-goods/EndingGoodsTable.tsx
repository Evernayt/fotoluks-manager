import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import EndingGoodsToolbar from './EndingGoodsToolbar';
import { endingGoodsTableColumns } from './EndingGoodsTable.colums';
import { INotification } from 'models/api/moysklad/INotification';
import { endingGoodsActions } from 'store/reducers/EndingGoodsSlice';
import { Row } from '@tanstack/react-table';
import { modalActions } from 'store/reducers/ModalSlice';
import { setNotAvailableGoods, setOrderedGoods } from 'helpers/localStorage';
import { getErrorToast } from 'helpers/toast';

export interface IEndingGood extends INotification {
  ordered: boolean;
  notAvailable: boolean;
  active: boolean;
}

const EndingGoodsTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);

  const isLoading = useAppSelector((state) => state.moysklad.isLoading);
  const forceUpdate = useAppSelector((state) => state.moysklad.forceUpdate);
  const endingGoods = useAppSelector((state) => state.endingGoods.endingGoods);
  const orderedGoods = useAppSelector(
    (state) => state.endingGoods.orderedGoods
  );
  const notAvailableGoods = useAppSelector(
    (state) => state.endingGoods.notAvailableGoods
  );

  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    fetchEndingGoods(page);
  }, []);

  useEffect(() => {
    if (forceUpdate) {
      fetchEndingGoods(page);
      dispatch(moyskladActions.setForceUpdate(false));
    }
  }, [forceUpdate]);

  useEffect(() => {
    setOrderedGoods(orderedGoods);
  }, [orderedGoods]);

  useEffect(() => {
    setNotAvailableGoods(notAvailableGoods);
  }, [notAvailableGoods]);

  const fetchEndingGoods = (page: number) => {
    const offset = limit * (page - 1);
    dispatch(moyskladActions.setIsLoading(true));

    MoyskladAPI.getNotifications({ limit, offset })
      .then((data) => {
        const endingGoodsData: IEndingGood[] = [];
        data.rows?.forEach((notification) => {
          if (notification.good) {
            const ordered = orderedGoods.some(
              (id) => id === notification.good.id
            );
            const notAvailable = notAvailableGoods.some(
              (id) => id === notification.good.id
            );

            endingGoodsData.push({
              id: notification.id,
              actualBalance: notification.actualBalance,
              good: notification.good,
              ordered,
              notAvailable,
              active: false,
            });
          }
        });

        const noDuplicatesEndingGoods = endingGoodsData.filter(
          (value, index, self) =>
            index === self.findIndex((x) => x.good.id === value.good.id)
        );
        dispatch(endingGoodsActions.setEndingGoods(noDuplicatesEndingGoods));
        setPageCount(Math.ceil(2000 / limit));
      })
      .catch(() => toast(getErrorToast('StocksTable.fetchAssortments')))
      .finally(() => dispatch(moyskladActions.setIsLoading(false)));
  };

  const reload = (page: number) => {
    fetchEndingGoods(page);
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IEndingGood>) => {
    const endingGood = row.original;
    dispatch(endingGoodsActions.activeEndingGoodsRowById(endingGood.id));
    dispatch(
      modalActions.openModal({
        modal: 'endingGoodsProductModal',
        props: { endingGood },
      })
    );
  };

  return (
    <>
      <EndingGoodsToolbar
        reload={() => reload(page)}
        onLimitChange={setLimit}
      />
      <Table
        columns={endingGoodsTableColumns}
        data={endingGoods}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        onRowClick={rowClickHandler}
      />
    </>
  );
};

export default EndingGoodsTable;
