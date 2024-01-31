import { useToast } from '@chakra-ui/react';
import OrderAPI from 'api/OrderAPI/OrderAPI';
import { Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderActions } from 'store/reducers/OrderSlice';
import { ordersTableColumns } from './OrdersTable.colums';
import OrdersToolbar from './OrdersToolbar';
import { useDebounce } from 'hooks';
import { filterActions } from 'store/reducers/FilterSlice';
import { IOrder, IOrdersFilter } from 'models/api/IOrder';
import {
  Row,
  SortingState,
  Updater,
  functionalUpdate,
} from '@tanstack/react-table';
import { ORDER_DETAIL_ROUTE } from 'constants/paths';
import { useContextMenu } from 'react-contexify';
import OrdersTableContextMenu, {
  ORDERS_TABLE_MENU_ID,
} from './context-menu/OrdersTableContextMenu';
import { getErrorToast } from 'helpers/toast';

const OrdersTable = () => {
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);

  const orders = useAppSelector((state) => state.order.orders);
  const isLoading = useAppSelector((state) => state.order.isLoading);
  const ordersFilter = useAppSelector((state) => state.filter.ordersFilter);
  const activeStatus = useAppSelector((state) => state.order.activeStatus);
  const activeShop = useAppSelector((state) => state.app.activeShop);
  const search = useAppSelector((state) => state.order.search);
  const forceUpdate = useAppSelector((state) => state.order.forceUpdate);
  const sortings = useAppSelector((state) => state.order.sortings);
  const orderEditors = useAppSelector((state) => state.order.orderEditors);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { show } = useContextMenu({ id: ORDERS_TABLE_MENU_ID });

  useEffect(() => {
    reloadAndChangePage(1);
  }, [activeStatus]);

  useEffect(() => {
    reloadAndChangePage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (ordersFilter.isActive) {
      reloadAndChangePage(1);
    } else if (ordersFilter.isPendingDeactivation) {
      dispatch(filterActions.deactiveFilter('ordersFilter'));
      fetchOrders(currentPage, { shopIds: [1, activeShop.id] });
    } else if (forceUpdate) {
      fetchOrders(currentPage, { shopIds: [1, activeShop.id] });
    }
    dispatch(orderActions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchOrders = (page: number, filter?: IOrdersFilter) => {
    if (!activeStatus) return;
    dispatch(orderActions.setIsLoading(true));

    OrderAPI.getAll({
      ...filter,
      limit,
      page,
      search,
      statusId: activeStatus.id,
    })
      .then((data) => {
        dispatch(orderActions.setOrders(data.rows));
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .catch((e) => toast(getErrorToast('OrdersTable.fetchOrders', e)))
      .finally(() => dispatch(orderActions.setIsLoading(false)));
  };

  const reload = (page: number = currentPage) => {
    if (ordersFilter.isActive) {
      fetchOrders(page, ordersFilter);
    } else {
      fetchOrders(page, { shopIds: [1, activeShop.id] });
    }
  };

  const reloadAndChangePage = (page: number) => {
    setCurrentPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IOrder>) => {
    navigate(ORDER_DETAIL_ROUTE, {
      state: { orderId: row.original.id },
    });
  };

  const handleContextMenu = (row: Row<IOrder>, event: any) => {
    show({ event, props: row.original });
  };

  const sortingChangeHandler = (updater: Updater<SortingState>) => {
    const newSortings = functionalUpdate(updater, sortings);
    dispatch(orderActions.setSortings(newSortings));
  };

  return (
    <>
      <OrdersTableContextMenu />
      <OrdersToolbar reload={reload} onLimitChange={setLimit} />
      <Table
        columns={ordersTableColumns}
        data={orders}
        isLoading={isLoading}
        pagination={{
          page: currentPage,
          pageCount,
          onPageChange: reloadAndChangePage,
        }}
        editors={orderEditors}
        sorting={sortings}
        onSortingChange={sortingChangeHandler}
        onRowClick={rowClickHandler}
        onContextMenu={handleContextMenu}
      />
    </>
  );
};

export default OrdersTable;
