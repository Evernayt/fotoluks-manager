import { useToast } from '@chakra-ui/react';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { productsTableColumns } from './ProductsTable.colums';
import { useDebounce } from 'hooks';
import { filterActions } from 'store/reducers/FilterSlice';
import { Row, SortingState } from '@tanstack/react-table';
import { IProduct, IProductsFilter } from 'models/api/IProduct';
import ProductAPI from 'api/ProductAPI/ProductAPI';
import { controlActions } from 'store/reducers/ControlSlice';
import ProductsToolbar from './ProductsToolbar';
import { modalActions } from 'store/reducers/ModalSlice';
import { MODES } from 'constants/app';
import { useContextMenu } from 'react-contexify';
import ProductsContextMenu, {
  PRODUCTS_MENU_ID,
} from './context-menu/ProductsContextMenu';

const ProductsTable = () => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [sortings, setSortings] = useState<SortingState>([]);

  const isLoading = useAppSelector((state) => state.control.isLoading);
  const productsFilter = useAppSelector((state) => state.filter.productsFilter);
  const search = useAppSelector((state) => state.control.search);
  const forceUpdate = useAppSelector((state) => state.control.forceUpdate);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { show } = useContextMenu({ id: PRODUCTS_MENU_ID });

  useEffect(() => {
    reloadAndChangePage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (productsFilter.isActive) {
      reloadAndChangePage(1);
    } else if (productsFilter.isPendingDeactivation) {
      dispatch(filterActions.deactiveFilter('productsFilter'));
      fetchProducts(currentPage);
    } else if (forceUpdate) {
      fetchProducts(currentPage);
    }
    dispatch(controlActions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchProducts = (page: number, filter?: IProductsFilter) => {
    dispatch(controlActions.setIsLoading(true));

    ProductAPI.getAll({ ...filter, limit, page, search })
      .then((data) => {
        setProducts(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .catch((e) =>
        toast({
          title: 'ProductsTable.fetchProducts',
          description: e.response.data ? e.response.data.message : e.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      )
      .finally(() => dispatch(controlActions.setIsLoading(false)));
  };

  const reload = (page: number = currentPage) => {
    if (productsFilter.isActive) {
      fetchProducts(page, productsFilter);
    } else {
      fetchProducts(page);
    }
  };

  const reloadAndChangePage = (page: number) => {
    setCurrentPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IProduct>) => {
    dispatch(
      modalActions.openModal({
        modal: 'productsEditModal',
        props: { productId: row.original.id, mode: MODES.EDIT_MODE },
      })
    );
  };

  const handleContextMenu = (row: Row<IProduct>, event: any) => {
    show({ event, props: row.original });
  };

  return (
    <>
      <ProductsContextMenu />
      <ProductsToolbar reload={reload} onLimitChange={setLimit} />
      <Table
        columns={productsTableColumns}
        data={products}
        isLoading={isLoading}
        pagination={{
          page: currentPage,
          pageCount,
          onPageChange: reloadAndChangePage,
        }}
        sorting={sortings}
        onSortingChange={setSortings}
        onRowClick={rowClickHandler}
        onContextMenu={handleContextMenu}
      />
    </>
  );
};

export default ProductsTable;
