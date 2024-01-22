import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { useDebounce } from 'hooks';
import DefectiveGoodsToolbar from './DefectiveGoodsToolbar';
import { defectiveGoodsTableColumns } from './DefectiveGoodsTable.colums';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { ISupply } from 'models/api/moysklad/ISupply';
import { defectiveGoodsActions } from 'store/reducers/DefectiveGoodsSlice';

const DefectiveGoodsTable = () => {
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
      fetchSuppliesByProduct(page);
    } else {
      reload(page);
    }
  }, [debouncedSearchTerm]);

  const fetchSuppliesByProduct = (page: number) => {
    if (!search) {
      setSupplies([]);
      dispatch(defectiveGoodsActions.setFoundProduct(null));
      return;
    }

    const offset = limit * (page - 1);
    dispatch(moyskladActions.setIsLoading(true));

    MoyskladAPI.getAssortment({ search, limit: 1 }).then((data) => {
      if (data?.rows.length) {
        dispatch(defectiveGoodsActions.setFoundProduct(data.rows[0]));

        const productHref = data.rows[0].meta.href;
        MoyskladAPI.getSupplies({ limit, offset, productHref })
          .then((data2) => {
            setSupplies(data2.rows);
            setPageCount(Math.ceil((data2.meta?.size || 0) / limit));
          })
          .catch(() =>
            toast({
              title: 'DefectiveGoodsTable.fetchSupplies',
              description: 'Ошибка',
              status: 'error',
              duration: 9000,
              isClosable: true,
            })
          )
          .finally(() => dispatch(moyskladActions.setIsLoading(false)));
      } else {
        dispatch(defectiveGoodsActions.setFoundProduct(null));
        dispatch(moyskladActions.setIsLoading(false));
      }
    });
  };

  const reload = (page: number) => {
    fetchSuppliesByProduct(page);
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  return (
    <>
      <DefectiveGoodsToolbar
        reload={() => reload(page)}
        onLimitChange={setLimit}
      />
      <Table
        columns={defectiveGoodsTableColumns}
        data={supplies}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        notFoundText="Введите наименование, код, штрихкод или артикул"
      />
    </>
  );
};

export default DefectiveGoodsTable;
