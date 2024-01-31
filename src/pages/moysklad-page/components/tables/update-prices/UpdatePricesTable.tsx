import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { useDebounce } from 'hooks';
import UpdatePricesToolbar from './UpdatePricesToolbar';
import { updatePricesTableColumns } from './UpdatePricesTable.colums';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { ISupply } from 'models/api/moysklad/ISupply';
import { Row } from '@tanstack/react-table';
import { modalActions } from 'store/reducers/ModalSlice';
import { getErrorToast } from 'helpers/toast';

const UpdatePricesTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [supplies, setSupplies] = useState<ISupply[]>([]);

  const isLoading = useAppSelector((state) => state.moysklad.isLoading);
  const search = useAppSelector((state) => state.moysklad.search);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSupplies(page);
    } else {
      reload(page);
    }
  }, [debouncedSearchTerm]);

  const fetchSupplies = (page: number) => {
    const offset = limit * (page - 1);
    dispatch(moyskladActions.setIsLoading(true));

    MoyskladAPI.getSupplies({ limit, offset, search })
      .then((data) => {
        if (!data.rows.length) {
          setPageCount(0);
        }
        setSupplies(data.rows);
        setPageCount(Math.ceil((data.meta?.size || 0) / limit));
      })
      .catch(() => toast(getErrorToast('UpdatePricesTable.fetchSupplies')))
      .finally(() => dispatch(moyskladActions.setIsLoading(false)));
  };

  const reload = (page: number) => {
    fetchSupplies(page);
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<ISupply>) => {
    dispatch(
      modalActions.openModal({
        modal: 'updatePricesModal',
        props: { id: row.original.id, name: row.original.name },
      })
    );
  };

  return (
    <>
      <UpdatePricesToolbar
        reload={() => reload(page)}
        onLimitChange={setLimit}
      />
      <Table
        columns={updatePricesTableColumns}
        data={supplies}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        onRowClick={rowClickHandler}
      />
    </>
  );
};

export default UpdatePricesTable;
