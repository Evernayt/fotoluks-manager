import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { useDebounce } from 'hooks';
import SubtractFromSuppliesToolbar from './SubtractFromSuppliesToolbar';
import { subtractFromSuppliesTableColumns } from './SubtractFromSuppliesTable.colums';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { ISupply } from 'models/api/moysklad/ISupply';
import { Row } from '@tanstack/react-table';
import { getErrorToast } from 'helpers/toast';
import { subtractFromSupplyActions } from 'store/reducers/SubtractFromSupplySlice';
import { modalActions } from 'store/reducers/ModalSlice';

const SubtractFromSuppliesTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [supplies, setSupplies] = useState<ISupply[]>([]);

  const isLoading = useAppSelector((state) => state.moysklad.isLoading);
  const search = useAppSelector(
    (state) => state.moysklad.subtractFromSuppliesSearch
  );
  const lastActiveRowId = useAppSelector(
    (state) => state.subtractFromSupply.lastActiveRowId
  );

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
        setSupplies(data.rows || []);
        setPageCount(Math.ceil((data.meta?.size || 0) / limit));
      })
      .catch(() =>
        toast(getErrorToast('SubtractFromSuppliesTable.fetchSupplies'))
      )
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
    dispatch(subtractFromSupplyActions.setLastActiveRowId(row.original.id));
    dispatch(
      modalActions.openModal({
        modal: 'subtractFromSuppliesModal',
        props: { id: row.original.id, name: row.original.name },
      })
    );
  };

  return (
    <>
      <SubtractFromSuppliesToolbar
        reload={() => reload(page)}
        onLimitChange={setLimit}
      />
      <Table
        columns={subtractFromSuppliesTableColumns}
        data={supplies}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        lastActiveRowId={lastActiveRowId}
        onRowClick={rowClickHandler}
      />
    </>
  );
};

export default SubtractFromSuppliesTable;
