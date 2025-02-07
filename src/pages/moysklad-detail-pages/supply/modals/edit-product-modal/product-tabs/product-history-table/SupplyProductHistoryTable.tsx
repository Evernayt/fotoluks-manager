import { Table } from 'components';
import { supplyProductHistoryTableColumns } from './SupplyProductHistoryTable.colums';
import { FC, useEffect, useState } from 'react';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import { useToast } from '@chakra-ui/react';
import { getErrorToast } from 'helpers/toast';
import { ISupply } from 'models/api/moysklad/ISupply';
import { getPathFromUrl } from 'helpers';

interface SupplyProductHistoryTableProps {
  assortment: IAssortment | undefined;
}

const SupplyProductHistoryTable: FC<SupplyProductHistoryTableProps> = ({
  assortment,
}) => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [supplies, setSupplies] = useState<ISupply[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const limit = 5;

  const toast = useToast();

  useEffect(() => {
    fetchSupplies(page);
  }, []);

  const fetchSupplies = (page: number) => {
    if (!assortment) return;

    const offset = limit * (page - 1);
    setIsLoading(true);

    const productHref = getPathFromUrl(assortment.meta.href);

    MoyskladAPI.getSupplies({
      limit,
      offset,
      productHref,
      expand: 'agent,positions',
    })
      .then((data) => {
        const filteredSupplies = data.rows?.map((supply) => {
          const rows = supply.positions.rows?.filter(
            (position) => position.assortment?.meta.href === productHref
          );
          return { ...supply, positions: { rows } };
        });
        console.log(data.rows);
        setSupplies(filteredSupplies || []);
        setPageCount(Math.ceil((data.meta?.size || 0) / limit));
      })
      .catch(() =>
        toast(getErrorToast('SupplyProductHistoryTable.fetchSupplies'))
      )
      .finally(() => setIsLoading(false));
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    fetchSupplies(page);
  };

  return (
    <Table
      columns={supplyProductHistoryTableColumns}
      data={supplies}
      isLoading={isLoading}
      loaderProps={{ minHeight: '216px' }}
      notFoundTextProps={{ minHeight: '216px' }}
      pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
    />
  );
};

export default SupplyProductHistoryTable;
