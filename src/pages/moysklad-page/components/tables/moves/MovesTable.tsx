import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { useDebounce } from 'hooks';
import MovesToolbar from './MovesToolbar';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { movesTableColumns } from './MovesTable.colums';
import { IMove } from 'models/api/moysklad/IMove';
import { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { MOVES_DETAIL_ROUTE } from 'constants/paths';
import { getErrorToast } from 'helpers/toast';

const MovesTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [moves, setMoves] = useState<IMove[]>([]);

  const isLoading = useAppSelector((state) => state.moysklad.isLoading);
  const search = useAppSelector((state) => state.moysklad.search);
  const moveEditors = useAppSelector((state) => state.move.moveEditors);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchMoves(page);
    } else {
      reload(page);
    }
  }, [debouncedSearchTerm]);

  const fetchMoves = (page: number) => {
    const offset = limit * (page - 1);
    dispatch(moyskladActions.setIsLoading(true));

    MoyskladAPI.getMoves({ limit, offset, search })
      .then((data) => {
        if (!data.rows?.length) {
          setPageCount(0);
        }
        setMoves(data.rows || []);
        setPageCount(Math.ceil((data.meta?.size || 0) / limit));
      })
      .catch(() => toast(getErrorToast('MovesTable.fetchMoves')))
      .finally(() => dispatch(moyskladActions.setIsLoading(false)));
  };

  const reload = (page: number) => {
    fetchMoves(page);
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IMove>) => {
    navigate(MOVES_DETAIL_ROUTE, {
      state: { moveId: row.original.id, created: row.original.created },
    });
  };

  return (
    <>
      <MovesToolbar reload={() => reload(page)} onLimitChange={setLimit} />
      <Table
        columns={movesTableColumns}
        data={moves}
        isLoading={isLoading}
        editors={moveEditors}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        onRowClick={rowClickHandler}
      />
    </>
  );
};

export default MovesTable;
