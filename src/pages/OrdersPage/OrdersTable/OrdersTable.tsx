import OrderAPI from 'api/OrderAPI/OrderAPI';
import StatusAPI from 'api/StatusAPI/StatusAPI';
import { Table } from 'components';
import { DEF_DATE_FORMAT } from 'constants/app';
import { ORDER_DETAIL_ROUTE } from 'constants/paths';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IOrder, IOrdersFilter } from 'models/api/IOrder';
import { IStatus } from 'models/api/IStatus';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cell, Row } from 'react-table';
import { orderSlice } from 'store/reducers/OrderSlice';
import OrderMenuCell from './OrdersCells/OrderMenuCell';
import OrderStatusCell from './OrdersCells/OrderStatusCell';
import OrdersToolbar from './OrdersToolbar/OrdersToolbar';
import OrderDeadlineCell from './OrdersCells/OrderDeadlineCell';
import { useDebounce } from 'hooks';
import { createServicesName } from './OrdersTable.service';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';

const OrdersTable = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [statuses, setStatuses] = useState<IStatus[]>([]);

  const orders = useAppSelector((state) => state.order.orders);
  const isLoading = useAppSelector((state) => state.order.isLoading);
  const ordersFilter = useAppSelector((state) => state.order.ordersFilter);
  const activeStatus = useAppSelector((state) => state.order.activeStatus);
  const activeShop = useAppSelector((state) => state.app.activeShop);
  const search = useAppSelector((state) => state.order.search);
  const forceUpdate = useAppSelector((state) => state.order.forceUpdate);

  const debouncedSearchTerm = useDebounce(search);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const columns = useMemo<any>(
    () => [
      {
        Header: '№',
        accessor: 'id',
      },
      {
        Header: 'Дата создания',
        accessor: 'createdAt',
        style: { minWidth: '110px' },
        Cell: ({ value }: Cell<IOrder>) =>
          moment(value).format(DEF_DATE_FORMAT),
      },
      {
        Header: 'Услуги',
        style: { width: '100%' },
        accessor: (order: IOrder) => createServicesName(order),
      },
      {
        Header: 'Сумма',
        accessor: 'sum',
      },
      {
        Header: 'Статус',
        accessor: 'status',
        Cell: ({ value }: Cell<IOrder>) => value.name,
      },
      {
        Header: 'Филиал',
        accessor: 'shop.name',
      },
      {
        Header: 'Срок',
        style: { minWidth: '110px' },
        accessor: 'deadline',
        Cell: ({ value }: Cell<IOrder>) =>
          value === null ? 'Не указано' : moment(value).format(DEF_DATE_FORMAT),
      },
      {
        Header: 'Имя клиента',
        style: { minWidth: '100px' },
        accessor: 'user.name',
      },
      {
        Header: '',
        accessor: 'menu',
        Cell: OrderMenuCell,
      },
    ],
    []
  );

  useEffect(() => {
    fetchStatuses();
  }, []);

  useEffect(() => {
    pageChangeHandler(1);
  }, [activeStatus]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchOrders(page, { ...ordersFilter, search });
    } else {
      reload(page);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (ordersFilter.isActive) {
      fetchOrders(page, ordersFilter);
    } else if (ordersFilter.isPendingDeactivation) {
      dispatch(orderSlice.actions.deactiveOrdersFilter());
      fetchOrders(page, { shopIds: [1, activeShop.id] });
    } else if (forceUpdate) {
      fetchOrders(page, { shopIds: [1, activeShop.id] });
    }
    dispatch(orderSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchOrders = (page: number, filter?: IOrdersFilter) => {
    if (!activeStatus) return;
    dispatch(orderSlice.actions.setIsLoading(true));

    OrderAPI.getAll({
      ...filter,
      limit,
      page,
      statusId: activeStatus.id,
    })
      .then((data) => {
        dispatch(orderSlice.actions.setOrders(data.rows));
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .catch((e) =>
        showGlobalMessage(e.response.data ? e.response.data.message : e.message)
      )
      .finally(() => dispatch(orderSlice.actions.setIsLoading(false)));
  };

  const fetchStatuses = () => {
    StatusAPI.getAll().then((data) => {
      setStatuses(data.rows);
    });
  };

  const reload = (page: number) => {
    if (ordersFilter.isActive) {
      fetchOrders(page, ordersFilter);
    } else {
      fetchOrders(page, { shopIds: [1, activeShop.id] });
    }
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const rowClickHandler = (row: Row<IOrder>) => {
    navigate(ORDER_DETAIL_ROUTE, {
      state: { orderId: row.values.id },
    });
  };

  return (
    <>
      <OrdersToolbar reload={() => reload(page)} onLimitChange={setLimit} />
      <Table
        columns={columns}
        data={orders}
        isLoading={isLoading}
        pagination={{ page, pageCount, onPageChange: pageChangeHandler }}
        onRowClick={rowClickHandler}
        customCells={[
          {
            accessor: 'status',
            cell: OrderStatusCell,
            props: { statuses },
          },
          {
            accessor: 'deadline',
            cell: OrderDeadlineCell,
          },
        ]}
      />
    </>
  );
};

export default OrdersTable;
