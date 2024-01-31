import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { useDebounce } from 'hooks';
import StocksToolbar from './StocksToolbar';
import { stocksTableColumns } from './StocksTable.colums';
import { IMoyskladData } from 'models/api/moysklad/IMoyskladData';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import { IStore } from 'models/api/moysklad/IStore';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { getErrorToast } from 'helpers/toast';

interface IAssortmentData {
  getAssortment: Promise<IMoyskladData<IAssortment> | undefined>;
  store: IStore;
}

export interface IAssortmentWithStore extends IAssortment {
  lunaStock?: number;
  michStock?: number;
}

const StocksTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [assortments, setAssortments] = useState<IAssortmentWithStore[]>([]);

  const isLoading = useAppSelector((state) => state.moysklad.isLoading);
  const search = useAppSelector((state) => state.moysklad.search);

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

    const assortmentsWithStore: IAssortmentWithStore[] = [];
    let assortmentsSize = 0;
    MoyskladAPI.getStores().then((data) => {
      const assortmentData: IAssortmentData[] = [];
      data.rows?.forEach((store) => {
        const getAssortment = MoyskladAPI.getAssortment({
          limit,
          offset,
          search,
          stockStore: store.meta.href,
        });
        assortmentData.push({ getAssortment, store });
      });

      Promise.all(assortmentData.map((promise) => promise.getAssortment))
        .then((results) => {
          results.forEach((result, i) => {
            assortmentsSize = result?.meta?.size || 0;
            result?.rows?.forEach((assortment, j) => {
              if (i === 0) {
                assortmentsWithStore.push({
                  ...assortment,
                  lunaStock: assortment.stock || 0,
                  michStock: assortment.stock || 0,
                });
              } else {
                if (assortmentData[i].store.name.includes('Луна')) {
                  assortmentsWithStore[j] = {
                    ...assortmentsWithStore[j],
                    lunaStock: assortment.stock || 0,
                  };
                } else {
                  assortmentsWithStore[j] = {
                    ...assortmentsWithStore[j],
                    michStock: assortment.stock || 0,
                  };
                }
              }
            });
          });

          setAssortments(assortmentsWithStore);
          setPageCount(Math.ceil(assortmentsSize / limit));
        })
        .catch(() => toast(getErrorToast('StocksTable.fetchAssortments')))
        .finally(() => dispatch(moyskladActions.setIsLoading(false)));
    });
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
      <StocksToolbar reload={() => reload(page)} onLimitChange={setLimit} />
      <Table
        columns={stocksTableColumns}
        data={assortments}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
      />
    </>
  );
};

export default StocksTable;
