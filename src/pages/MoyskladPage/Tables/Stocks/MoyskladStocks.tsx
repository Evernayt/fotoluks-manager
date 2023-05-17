import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { Table } from 'components';
import { useDebounce } from 'hooks';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import { IMoyskladData } from 'models/api/moysklad/IMoyskladData';
import { IStore } from 'models/api/moysklad/IStore';
import { useEffect, useMemo, useState } from 'react';
import { moyskladSlice } from 'store/reducers/MoyskladSlice';
import MoyskladStocksToolbar from './Toolbar/MoyskladStocksToolbar';

interface IAssortmentData {
  promise: Promise<IMoyskladData<IAssortment>>;
  store: IStore;
}

interface IAssortmentWithStore extends IAssortment {
  lunaStock?: number;
  michStock?: number;
}

const MoyskladStocks = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [assortments, setAssortments] = useState<IAssortmentWithStore[]>([]);

  const isLoading = useAppSelector((state) => state.moysklad.isLoading);
  const search = useAppSelector((state) => state.moysklad.search);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();

  const columns = useMemo<any>(
    () => [
      {
        Header: 'Наименование',
        accessor: 'name',
        style: { width: '100%' },
      },
      {
        Header: 'Артикул',
        accessor: 'article',
        style: { whiteSpace: 'nowrap' },
      },
      {
        Header: 'Код',
        accessor: 'code',
        style: { whiteSpace: 'nowrap' },
      },
      {
        Header: 'Луна',
        accessor: 'lunaStock',
      },
      {
        Header: 'Мич',
        accessor: 'michStock',
      },
    ],
    []
  );

  useEffect(() => {
    fetchAssortments();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchAssortments();
    } else {
      reload();
    }
  }, [debouncedSearchTerm]);

  const fetchAssortments = (offset: number = 0) => {
    dispatch(moyskladSlice.actions.setIsLoading(true));

    MoyskladAPI.getStores().then((data) => {
      const promises: IAssortmentData[] = [];
      data.rows.forEach((store) => {
        const getAssortment = MoyskladAPI.getAssortment({
          limit,
          offset,
          search,
          stockStore: store.meta.href,
        });
        promises.push({ promise: getAssortment, store });
      });

      Promise.all(promises.map((promise) => promise.promise))
        .then((results) => {
          if (results.length && !results[0].rows.length) {
            setPageCount(0);
          }

          const assortmentsWithStore: IAssortmentWithStore[] = [];
          results.forEach((result, i) => {
            result.rows.forEach((assortment, j) => {
              if (i === 0) {
                assortmentsWithStore.push({
                  ...assortment,
                  lunaStock: assortment.stock || 0,
                  michStock: assortment.stock || 0,
                });
              } else {
                if (promises[i].store.name.includes('Луна')) {
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
          setPageCount(Math.ceil(500 / limit));
        })
        .catch(() => {})
        .finally(() => dispatch(moyskladSlice.actions.setIsLoading(false)));
    });
  };

  const pageChangeHandler = (page: number) => {
    const offset = limit * (page - 1);
    setPage(page);
    fetchAssortments(offset);
  };

  const reload = () => {
    setPage(1);
    fetchAssortments();
  };

  return (
    <>
      <MoyskladStocksToolbar reload={reload} onLimitChange={setLimit} />
      <Table
        columns={columns}
        data={assortments}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
      />
    </>
  );
};

export default MoyskladStocks;
