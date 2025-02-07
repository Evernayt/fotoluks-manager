import { Table } from 'components';
import { supplyProductStocksTableColumns } from './SupplyProductStocksTable.colums';
import { FC, useEffect, useState } from 'react';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import { IStore } from 'models/api/moysklad/IStore';
import { useToast } from '@chakra-ui/react';
import { getErrorToast } from 'helpers/toast';

interface SupplyProductStocksTableProps {
  assortment: IAssortment | undefined;
}

const SupplyProductStocksTable: FC<SupplyProductStocksTableProps> = ({
  assortment,
}) => {
  const [stores, setStores] = useState<IStore[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const toast = useToast();

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = () => {
    if (!assortment) return;

    MoyskladAPI.getStocks({
      type: assortment.meta.type,
      productHref: assortment.meta.href,
    })
      .then((data) => {
        if (data.rows && data.rows.length > 0) {
          setStores(data.rows[0].stockByStore);
        }
      })
      .catch(() => toast(getErrorToast('SupplyProductStocksTable.fetchStocks')))
      .finally(() => setIsLoading(false));
  };

  return (
    <Table
      columns={supplyProductStocksTableColumns}
      data={stores}
      isLoading={isLoading}
      loaderProps={{ minHeight: '216px' }}
      notFoundTextProps={{ minHeight: '216px' }}
    />
  );
};

export default SupplyProductStocksTable;
