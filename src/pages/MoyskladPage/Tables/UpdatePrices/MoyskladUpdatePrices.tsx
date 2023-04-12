import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { Table } from 'components';
import { DEF_DATE_FORMAT } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { ISupply } from 'models/api/moysklad/ISupply';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { Cell, Row } from 'react-table';
import { modalSlice } from 'store/reducers/ModalSlice';
import { moyskladSlice } from 'store/reducers/MoyskladSlice';
import MoyskladUpdatePricesToolbar from './Toolbar/MoyskladUpdatePricesToolbar';

const MoyskladUpdatePrices = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [supplies, setSupplies] = useState<ISupply[]>([]);

  const isLoading = useAppSelector((state) => state.moysklad.isLoading);

  const dispatch = useAppDispatch();

  const columns = useMemo<any>(
    () => [
      {
        Header: '№',
        accessor: 'name',
      },
      {
        Header: 'Дата создания',
        accessor: 'created',
        style: { minWidth: '110px' },
        Cell: ({ value }: Cell<ISupply>) =>
          moment(value).format(DEF_DATE_FORMAT),
      },
      {
        Header: 'Входящий номер',
        accessor: 'incomingNumber',
        style: { width: '100%' },
      },
      {
        Header: 'Сумма',
        accessor: 'sum',
        Cell: ({ value }: Cell<ISupply>) => (value * 0.01).toFixed(2),
      },
      {
        Header: 'Описание',
        accessor: 'description',
        style: {
          maxWidth: '300px',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        },
      },
    ],
    [page, limit]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchSupplies(0, controller.signal);
    return () => controller.abort();
  }, []);

  const fetchSupplies = (offset: number, signal?: AbortSignal) => {
    dispatch(moyskladSlice.actions.setIsLoading(true));

    MoyskladAPI.getSupplies({ limit, offset }, signal)
      .then((data) => {
        if (!data.rows.length) {
          setPageCount(0);
        }
        setSupplies(data.rows);
        setPageCount(Math.ceil(500 / limit));
      })
      .catch(() => {})
      .finally(() => dispatch(moyskladSlice.actions.setIsLoading(false)));
  };

  const pageChangeHandler = (page: number) => {
    const offset = limit * (page - 1);
    setPage(page);
    fetchSupplies(offset);
  };

  const reload = () => {
    setPage(1);
    fetchSupplies(0);
  };

  const rowClickHandler = (row: Row<ISupply>) => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'updatePriceModal',
        props: { id: row.original.id, name: row.original.name },
      })
    );
  };

  return (
    <>
      <MoyskladUpdatePricesToolbar reload={reload} onLimitChange={setLimit} />
      <Table
        columns={columns}
        data={supplies}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        onRowClick={rowClickHandler}
      />
    </>
  );
};

export default MoyskladUpdatePrices;
