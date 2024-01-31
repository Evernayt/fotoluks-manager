import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { FC, useEffect, useState } from 'react';
import {
  assortmentsTableColumns,
  assortmentsTableColumnsWithSelect,
} from './MoyskladAssortmentsTable.colums';
import { useDebounce } from 'hooks';
import { Row, RowSelectionState } from '@tanstack/react-table';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import MoyskladAssortmentsToolbar from './MoyskladAssortmentsToolbar';
import ProductAPI from 'api/ProductAPI/ProductAPI';
import { useAppDispatch } from 'hooks/redux';
import { controlActions } from 'store/reducers/ControlSlice';
import { getErrorToast } from 'helpers/toast';

interface MoyskladAssortmentsTableProps {
  enableRowSelection: boolean;
  onAssortmentClick: (assortment: IAssortment) => void;
  onModalClose: () => void;
}

const MoyskladAssortmentsTable: FC<MoyskladAssortmentsTableProps> = ({
  enableRowSelection,
  onAssortmentClick,
  onModalClose,
}) => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [assortments, setAssortments] = useState<IAssortment[]>([]);
  const [selectedAssortments, setSelectedAssortments] =
    useState<RowSelectionState>({});
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    reloadAndChangePage(1);
  }, [debouncedSearchTerm]);

  const fetchAssortments = (page: number) => {
    const offset = limit * (page - 1);
    setIsLoading(true);

    MoyskladAPI.getAssortment({ limit, offset, search })
      .then((data) => {
        setAssortments(data?.rows || []);
        setPageCount(Math.ceil((data?.meta?.size || 0) / limit));
      })
      .catch(() =>
        toast(getErrorToast('MoyskladAssortmentsTable.fetchAssortments'))
      )
      .finally(() => setIsLoading(false));
  };

  const reload = (page: number = currentPage) => {
    fetchAssortments(page);
  };

  const reloadAndChangePage = (page: number) => {
    setCurrentPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IAssortment>) => {
    onAssortmentClick(row.original);
  };

  const createProducts = () => {
    setIsLoading(true);
    ProductAPI.bulkCreate({ moyskladIds: Object.keys(selectedAssortments) })
      .then(() => {
        dispatch(controlActions.setForceUpdate(true));
        onModalClose();
      })
      .catch((e) => {
        toast(getErrorToast('MoyskladAssortmentsTable.createProducts', e));
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <MoyskladAssortmentsToolbar
        isLoading={isLoading}
        reload={reload}
        search={search}
        selectedAssortments={selectedAssortments}
        onSearchChange={setSearch}
        onLimitChange={setLimit}
        createProducts={createProducts}
      />
      <Table
        columns={
          enableRowSelection
            ? assortmentsTableColumnsWithSelect
            : assortmentsTableColumns
        }
        data={assortments}
        isLoading={isLoading}
        enableRowSelection={enableRowSelection}
        pagination={{
          page: currentPage,
          pageCount,
          onPageChange: reloadAndChangePage,
        }}
        containerStyle={{ minHeight: '425px' }}
        loaderProps={{ minHeight: '472px' }}
        notFoundTextProps={{ minHeight: '472px' }}
        onRowClick={rowClickHandler}
        onRowSelect={setSelectedAssortments}
      />
    </>
  );
};

export default MoyskladAssortmentsTable;
