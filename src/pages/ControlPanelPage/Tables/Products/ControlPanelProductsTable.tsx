import { Table } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Row } from 'react-table';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { Modes } from 'constants/app';
import ControlPanelProductsToolbar from './Toolbar/ControlPanelProductsToolbar';
import { IProduct, IProductsFilter } from 'models/api/IProduct';
import ProductMenuCell from './Cells/ProductMenuCell';
import { useDebounce } from 'hooks';
import ProductAPI from 'api/ProductAPI/ProductAPI';

const ControlPanelProductsTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [products, setProducts] = useState<IProduct[]>([]);

  const search = useAppSelector((state) => state.controlPanel.search);
  const isLoading = useAppSelector((state) => state.controlPanel.isLoading);
  const forceUpdate = useAppSelector((state) => state.controlPanel.forceUpdate);
  const productsFilter = useAppSelector(
    (state) => state.controlPanel.productsFilter
  );

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();

  const columns = useMemo<any>(
    () => [
      {
        Header: '№',
        accessor: 'id',
      },
      {
        Header: 'Наименование',
        accessor: 'name',
        style: { width: '20%' },
      },
      {
        Header: 'Наименование (во мн. ч.)',
        accessor: 'pluralName',
        style: { width: '30%' },
      },
      {
        Header: 'Описание',
        accessor: 'description',
        style: { width: '50%' },
      },
      {
        Header: 'Категория',
        accessor: 'category.name',
      },
      {
        Header: '',
        accessor: 'menu',
        Cell: ProductMenuCell,
      },
    ],
    []
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(controlPanelSlice.actions.setDisableFilter(true));
      fetchProducts(page, { search });
    } else {
      dispatch(controlPanelSlice.actions.setDisableFilter(false));
      reload(page);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (productsFilter.isActive) {
      fetchProducts(page, productsFilter);
    } else if (productsFilter.isPendingDeactivation) {
      dispatch(controlPanelSlice.actions.deactiveFilter('productsFilter'));
      fetchProducts(page);
    } else if (forceUpdate) {
      fetchProducts(page);
    }
    dispatch(controlPanelSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchProducts = (page: number, filter?: IProductsFilter) => {
    dispatch(controlPanelSlice.actions.setIsLoading(true));

    ProductAPI.getAll({ ...filter, limit, page })
      .then((data) => {
        setProducts(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .finally(() => dispatch(controlPanelSlice.actions.setIsLoading(false)));
  };

  const reload = (page: number) => {
    if (productsFilter.isActive) {
      fetchProducts(page, productsFilter);
    } else {
      fetchProducts(page);
    }
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IProduct>) => {
    dispatch(
      modalSlice.actions.openModal({
        modal: 'controlPanelEditProductModal',
        props: { productId: row.original.id, mode: Modes.EDIT_MODE },
      })
    );
  };

  return (
    <>
      <ControlPanelProductsToolbar
        reload={() => reload(page)}
        onLimitChange={setLimit}
      />
      <Table
        columns={columns}
        data={products}
        isLoading={isLoading}
        pagination={{
          page,
          pageCount,
          onPageChange: pageChangeHandler,
          isShowing: search ? false : true,
        }}
        onRowClick={rowClickHandler}
      />
    </>
  );
};

export default ControlPanelProductsTable;
