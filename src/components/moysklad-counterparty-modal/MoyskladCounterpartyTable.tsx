import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { FC, useEffect, useState } from 'react';
import { counterpartyTableColumns } from './MoyskladCounterpartyTable.colums';
import { useDebounce } from 'hooks';
import { Row } from '@tanstack/react-table';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import MoyskladCounterpartyToolbar from './MoyskladCounterpartyToolbar';
import { ICounterparty } from 'models/api/moysklad/ICounterparty';

interface MoyskladCounterpartyTableProps {
  onCounterpartyClick: (counterparty: ICounterparty) => void;
}

const MoyskladCounterpartyTable: FC<MoyskladCounterpartyTableProps> = ({
  onCounterpartyClick,
}) => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [counterparties, setCounterparties] = useState<ICounterparty[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const debouncedSearchTerm = useDebounce(search);
  const toast = useToast();

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchCounterparties(page);
    } else {
      reload(page);
    }
  }, [debouncedSearchTerm]);

  const fetchCounterparties = (page: number) => {
    const offset = limit * (page - 1);
    setIsLoading(true);

    MoyskladAPI.getCounterparty({ limit, offset, search })
      .then((data) => {
        setCounterparties(data?.rows || []);
        setPageCount(Math.ceil((data?.meta?.size || 0) / limit));
      })
      .catch(() =>
        toast({
          title: 'MoyskladCounterpartyTable.fetchCounterparties',
          description: 'Ошибка',
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      )
      .finally(() => setIsLoading(false));
  };

  const reload = (page: number) => {
    fetchCounterparties(page);
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<ICounterparty>) => {
    onCounterpartyClick(row.original);
  };

  return (
    <>
      <MoyskladCounterpartyToolbar
        reload={() => reload(page)}
        search={search}
        onSearchChange={setSearch}
        onLimitChange={setLimit}
      />
      <Table
        columns={counterpartyTableColumns}
        data={counterparties}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        containerStyle={{ minHeight: '425px' }}
        loaderProps={{ minHeight: '472px' }}
        notFoundTextProps={{ minHeight: '472px' }}
        onRowClick={rowClickHandler}
      />
    </>
  );
};

export default MoyskladCounterpartyTable;
