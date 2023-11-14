import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { Table } from 'components';
import { DEF_DATE_FORMAT } from 'constants/app';
import { MOVES_DETAIL_ROUTE } from 'constants/paths';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IMove } from 'models/api/moysklad/IMove';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cell, Row } from 'react-table';
import { moyskladSlice } from 'store/reducers/MoyskladSlice';
import MoyskladMovesToolbar from './Toolbar/MoyskladMovesToolbar';

const MoyskladMovesTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [moves, setMoves] = useState<IMove[]>([]);

  const isLoading = useAppSelector((state) => state.moysklad.isLoading);
  const department = useAppSelector((state) => state.move.department);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const columns = useMemo<any>(
    () => [
      {
        Header: '№',
        Cell: ({ row }: any) => Number(row.index) + 1 + limit * (page - 1),
      },
      {
        Header: 'Дата создания',
        accessor: 'created',
        style: { minWidth: '110px' },
        Cell: ({ value }: Cell<IMove>) => moment(value).format(DEF_DATE_FORMAT),
      },
      {
        Header: 'Описание',
        accessor: 'description',
        style: { width: '100%' },
      },
    ],
    [page, limit]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchMoves(0, controller.signal);
    return () => controller.abort();
  }, [department]);

  const fetchMoves = (offset: number, signal?: AbortSignal) => {
    dispatch(moyskladSlice.actions.setIsLoading(true));

    const description = `(Отдел: ${department?.name}`;
    MoyskladAPI.getMoves({ limit, offset, description }, signal)
      .then((data) => {
        if (!data.rows.length) {
          setPageCount(0);
        }
        setMoves(data.rows);
        setPageCount(Math.ceil(500 / limit));
      })
      .catch(() => {})
      .finally(() => dispatch(moyskladSlice.actions.setIsLoading(false)));
  };

  const pageChangeHandler = (page: number) => {
    const offset = limit * (page - 1);
    setPage(page);
    fetchMoves(offset);
  };

  const reload = () => {
    setPage(1);
    fetchMoves(0);
  };

  const rowClickHandler = (row: Row<IMove>) => {
    navigate(MOVES_DETAIL_ROUTE, {
      state: { moveId: row.original.id, created: row.original.created },
    });
  };

  return (
    <>
      <MoyskladMovesToolbar reload={reload} onLimitChange={setLimit} />
      <Table
        columns={columns}
        data={moves}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        onRowClick={rowClickHandler}
      />
    </>
  );
};

export default MoyskladMovesTable;
