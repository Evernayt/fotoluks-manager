import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { Table } from 'components';
import { useDebounce } from 'hooks';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { ISupply } from 'models/api/moysklad/ISupply';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { Cell } from 'react-table';
import { defectiveGoodsSlice } from 'store/reducers/DefectiveGoodsSlice';
import { moyskladSlice } from 'store/reducers/MoyskladSlice';
import DefectiveGoodsAddCell from './Cells/DefectiveGoodsAddCell';
import DefectiveGoodsStatusCell from './Cells/DefectiveGoodsStatusCell';
import MoyskladDefectiveGoodsToolbar from './Toolbar/MoyskladDefectiveGoodsToolbar';

const MoyskladDefectiveGoodsTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [supplies, setSupplies] = useState<ISupply[]>([]);

  const isLoading = useAppSelector((state) => state.moysklad.isLoading);
  const search = useAppSelector((state) => state.moysklad.search);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();

  const columns = useMemo<any>(
    () => [
      {
        Header: '№',
        accessor: 'name',
      },
      {
        Header: 'Дата',
        accessor: 'incomingDate',
        Cell: ({ value }: Cell<ISupply>) =>
          value ? moment(value).format('DD.MM.YYYY') : '',
      },
      {
        Header: 'Контрагент',
        accessor: 'agent.name',
        style: {
          maxWidth: '300px',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        },
      },
      {
        Header: 'Входящий номер',
        accessor: 'incomingNumber',
        style: { width: '100%' },
      },
      {
        Header: 'Возврат',
        accessor: 'statusText',
        style: { minWidth: '110px' },
        Cell: DefectiveGoodsStatusCell,
      },
      {
        Header: '',
        accessor: 'addBtn',
        Cell: DefectiveGoodsAddCell,
      },
    ],
    []
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSupplies();
    } else {
      reload();
    }
  }, [debouncedSearchTerm]);

  const fetchSupplies = (offset: number = 0) => {
    if (!search) {
      setSupplies([]);
      dispatch(defectiveGoodsSlice.actions.setFoundProduct(null));
      return;
    }

    dispatch(moyskladSlice.actions.setIsLoading(true));
    MoyskladAPI.getAssortment({ search, limit: 1 }).then((data) => {
      if (data.rows.length) {
        dispatch(defectiveGoodsSlice.actions.setFoundProduct(data.rows[0]));

        const productHref = data.rows[0].meta.href;
        MoyskladAPI.getSupplies({ limit, offset, productHref })
          .then((data2) => {
            setSupplies(data2.rows);
            setPageCount(Math.ceil(125 / limit));
          })
          .catch(() => {})
          .finally(() => dispatch(moyskladSlice.actions.setIsLoading(false)));
      } else {
        dispatch(defectiveGoodsSlice.actions.setFoundProduct(null));
        dispatch(moyskladSlice.actions.setIsLoading(false));
      }
    });
  };

  const pageChangeHandler = (page: number) => {
    const offset = limit * (page - 1);
    setPage(page);
    fetchSupplies(offset);
  };

  const reload = () => {
    setPage(1);
    fetchSupplies();
  };

  return (
    <>
      <MoyskladDefectiveGoodsToolbar reload={reload} onLimitChange={setLimit} />
      <Table
        columns={columns}
        data={supplies}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        notFoundText="Введите наименование, код, штрихкод или артикул"
      />
    </>
  );
};

export default MoyskladDefectiveGoodsTable;
