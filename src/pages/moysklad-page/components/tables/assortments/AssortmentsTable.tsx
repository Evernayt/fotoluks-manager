import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { useDebounce } from 'hooks';
import AssortmentsToolbar from './AssortmentsToolbar';
import { assortmentsTableColumns } from './AssortmentsTable.colums';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { getErrorToast } from 'helpers/toast';

const AssortmentsTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [assortments, setAssortments] = useState<IAssortment[]>([]);

  const isLoading = useAppSelector((state) => state.moysklad.isLoading);
  const search = useAppSelector((state) => state.moysklad.assortmentsSearch);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchAssortments(page);
    } else {
      reload(page);
    }
  }, [debouncedSearchTerm]);

  const fetchAssortments = (page: number) => {
    const offset = limit * (page - 1);
    dispatch(moyskladActions.setIsLoading(true));

    MoyskladAPI.getAssortment({ limit, offset, search })
      .then((data) => {
        setAssortments(data.rows || []);
        setPageCount(Math.ceil((data.meta?.size || 0) / limit));
      })
      .catch(() => toast(getErrorToast('AssortmentsTable.fetchAssortments')))
      .finally(() => dispatch(moyskladActions.setIsLoading(false)));
  };

  const reload = (page: number) => {
    fetchAssortments(page);
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  return (
    <>
      <AssortmentsToolbar
        reload={() => reload(page)}
        onLimitChange={setLimit}
      />
      <Table
        columns={assortmentsTableColumns}
        data={assortments}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
      />
    </>
  );
};

export default AssortmentsTable;
