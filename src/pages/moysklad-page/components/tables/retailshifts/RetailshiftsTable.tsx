import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { useDebounce } from 'hooks';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { getErrorToast } from 'helpers/toast';
import { IRetailshift } from 'models/api/moysklad/IRetailshift';
import RetailshiftsToolbar from './RetailshiftsToolbar';
import { retailshiftsTableColumns } from './RetailshiftsTable.colums';

const RetailshiftsTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [retailshifts, setRetailshifts] = useState<IRetailshift[]>([]);

  const isLoading = useAppSelector((state) => state.moysklad.isLoading);
  const search = useAppSelector((state) => state.moysklad.retailshiftsSearch);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchRetailshifts(page);
    } else {
      reload(page);
    }
  }, [debouncedSearchTerm]);

  const fetchRetailshifts = async (page: number) => {
    try {
      const offset = limit * (page - 1);
      dispatch(moyskladActions.setIsLoading(true));
      const data = await MoyskladAPI.getRetailshifts({ limit, offset, search });
      setRetailshifts(data.rows || []);
      setPageCount(Math.ceil((data.meta?.size || 0) / limit));
    } catch (error) {
      toast(getErrorToast('RetailshiftsTable.fetchRetailshifts'));
    } finally {
      dispatch(moyskladActions.setIsLoading(false));
    }
  };

  const reload = (page: number) => {
    fetchRetailshifts(page);
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  return (
    <>
      <RetailshiftsToolbar
        reload={() => reload(page)}
        onLimitChange={setLimit}
      />
      <Table
        columns={retailshiftsTableColumns}
        data={retailshifts}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
      />
    </>
  );
};

export default RetailshiftsTable;
