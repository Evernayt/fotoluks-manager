import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { FC, useEffect, useState } from 'react';
import { subtractFromSuppliesMovesTableColumns } from './SubtractFromSuppliesMovesTable.colums';
import { useDebounce } from 'hooks';
import { RowSelectionState } from '@tanstack/react-table';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import SubtractFromSuppliesMovesToolbar from './SubtractFromSuppliesMovesToolbar';
import { getErrorToast } from 'helpers/toast';
import { IMove } from 'models/api/moysklad/IMove';

interface SubtractFromSuppliesMovesTableProps {
  onCreateFileClick: (move: string) => void;
}

const SubtractFromSuppliesMovesTable: FC<
  SubtractFromSuppliesMovesTableProps
> = ({ onCreateFileClick }) => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [moves, setMoves] = useState<IMove[]>([]);
  const [selectedMoves, setSelectedMoves] = useState<RowSelectionState>({});
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const debouncedSearchTerm = useDebounce(search);
  const toast = useToast();

  useEffect(() => {
    reloadAndChangePage(1);
  }, [debouncedSearchTerm]);

  const fetchMoves = (page: number) => {
    const offset = limit * (page - 1);
    setIsLoading(true);

    MoyskladAPI.getMoves({ limit, offset, search })
      .then((data) => {
        setMoves(data?.rows || []);
        setPageCount(Math.ceil((data?.meta?.size || 0) / limit));
      })
      .catch(() =>
        toast(getErrorToast('SubtractFromSuppliesMovesTable.fetchMoves'))
      )
      .finally(() => setIsLoading(false));
  };

  const reload = (page: number = currentPage) => {
    fetchMoves(page);
  };

  const reloadAndChangePage = (page: number) => {
    setCurrentPage(page);
    reload(page);
  };

  return (
    <>
      <SubtractFromSuppliesMovesToolbar
        isLoading={isLoading}
        reload={reload}
        search={search}
        selectedMoves={selectedMoves}
        onSearchChange={setSearch}
        onLimitChange={setLimit}
        onCreateFileClick={onCreateFileClick}
      />
      <Table
        columns={subtractFromSuppliesMovesTableColumns}
        data={moves}
        isLoading={isLoading}
        enableRowSelection
        enableMultiRowSelection={false}
        pagination={{
          page: currentPage,
          pageCount,
          onPageChange: reloadAndChangePage,
        }}
        containerStyle={{ minHeight: '425px' }}
        loaderProps={{ minHeight: '472px' }}
        notFoundTextProps={{ minHeight: '472px' }}
        onRowSelect={setSelectedMoves}
      />
    </>
  );
};

export default SubtractFromSuppliesMovesTable;
