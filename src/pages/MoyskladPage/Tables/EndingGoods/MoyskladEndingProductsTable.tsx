import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { Table } from 'components';
import { setNotAvailableGoods, setOrderedGoods } from 'helpers/localStorage';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { INotification } from 'models/api/moysklad/INotification';
import { useEffect, useMemo, useState } from 'react';
import { Row } from 'react-table';
import { endingGoodsSlice } from 'store/reducers/EndingGoodsSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { moyskladSlice } from 'store/reducers/MoyskladSlice';
import NotAvailableButtonCell from './Cells/NotAvailableButtonCell';
import OrderedButtonCell from './Cells/OrderedButtonCell';
import MoyskladEndingGoodsToolbar from './Toolbar/MoyskladEndingGoodsToolbar';

const MoyskladEndingGoodsTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);

  const isLoading = useAppSelector((state) => state.moysklad.isLoading);
  const forceUpdate = useAppSelector((state) => state.endingGoods.forceUpdate);
  const endingGoods = useAppSelector((state) => state.endingGoods.endingGoods);
  const orderedGoods = useAppSelector(
    (state) => state.endingGoods.orderedGoods
  );
  const notAvailableGoods = useAppSelector(
    (state) => state.endingGoods.notAvailableGoods
  );

  const dispatch = useAppDispatch();

  const columns = useMemo<any>(
    () => [
      {
        Header: 'Заказано',
        accessor: 'ordered',
        Cell: OrderedButtonCell,
      },
      {
        Header: 'Отсутствует',
        accessor: 'notAvailable',
        Cell: NotAvailableButtonCell,
      },
      {
        Header: 'Наименование',
        accessor: 'good.name',
        style: { width: '100%' },
      },
      {
        Header: 'Остаток',
        accessor: 'actualBalance',
      },
    ],
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchEndingGoods(0, controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (forceUpdate) {
      const offset = limit * (page - 1);
      fetchEndingGoods(offset);
      dispatch(endingGoodsSlice.actions.setForceUpdate(false));
    }
  }, [forceUpdate]);

  useEffect(() => {
    setOrderedGoods(orderedGoods);
  }, [orderedGoods]);

  useEffect(() => {
    setNotAvailableGoods(notAvailableGoods);
  }, [notAvailableGoods]);

  const fetchEndingGoods = (offset: number, signal?: AbortSignal) => {
    dispatch(moyskladSlice.actions.setIsLoading(true));

    MoyskladAPI.getNotifications({ limit, offset }, signal)
      .then((data) => {
        const endingGoodsData: INotification[] = [];
        data.rows.forEach((notification) => {
          if (notification.good) {
            const ordered = orderedGoods.find((x) => x === notification.good.id)
              ? true
              : false;
            const notAvailable = notAvailableGoods.find(
              (x) => x === notification.good.id
            )
              ? true
              : false;

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
        dispatch(
          endingGoodsSlice.actions.setEndingGoods(noDuplicatesEndingGoods)
        );
        setPageCount(Math.ceil(1000 / limit));
      })
      .catch(() => {})
      .finally(() => dispatch(moyskladSlice.actions.setIsLoading(false)));
  };

  const pageChangeHandler = (page: number) => {
    const offset = limit * (page - 1);
    setPage(page);
    fetchEndingGoods(offset);
  };

  const reload = () => {
    setPage(1);
    fetchEndingGoods(0);
  };

  const rowClickHandler = (row: Row<INotification>) => {
    const notification = row.original;

    dispatch(
      endingGoodsSlice.actions.activeEndingGoodsRowById(notification.id)
    );

    dispatch(
      modalSlice.actions.openModal({
        modal: 'endingGoodsProductModal',
        props: { notification },
      })
    );
  };

  return (
    <>
      <MoyskladEndingGoodsToolbar reload={reload} onLimitChange={setLimit} />
      <Table
        columns={columns}
        data={endingGoods}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        onRowClick={rowClickHandler}
      />
    </>
  );
};

export default MoyskladEndingGoodsTable;
