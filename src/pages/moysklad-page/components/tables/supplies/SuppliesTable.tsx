import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { useDebounce } from 'hooks';
import SuppliesToolbar from './SuppliesToolbar';
import { suppliesTableColumns } from './SuppliesTable.colums';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { ISupply } from 'models/api/moysklad/ISupply';
import { Row } from '@tanstack/react-table';
import { getErrorToast } from 'helpers/toast';
import { useNavigate } from 'react-router-dom';
import { SUPPLY_DETAIL_ROUTE } from 'constants/paths';
import { supplyActions } from 'store/reducers/SupplySlice';

const SuppliesTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [supplies, setSupplies] = useState<ISupply[]>([]);

  const isLoading = useAppSelector((state) => state.moysklad.isLoading);
  const search = useAppSelector((state) => state.moysklad.suppliesSearch);
  const lastActiveRowId = useAppSelector(
    (state) => state.supply.lastActiveRowId
  );

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const navigate = useNavigate();

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
      .catch(() => toast(getErrorToast('SuppliesTable.fetchSupplies')))
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
    dispatch(supplyActions.setLastActiveRowId(row.original.id));
    navigate(SUPPLY_DETAIL_ROUTE, {
      state: { supplyId: row.original.id },
    });
  };

  return (
    <>
      <SuppliesToolbar reload={() => reload(page)} onLimitChange={setLimit} />
      <Table
        columns={suppliesTableColumns}
        data={supplies}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        lastActiveRowId={lastActiveRowId}
        onRowClick={rowClickHandler}
      />
    </>
  );
};

export default SuppliesTable;
