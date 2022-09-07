import { Loader, StatusSelectButton } from 'components';
import { fetchOrdersAPI, updateStatusAPI } from 'http/orderAPI';
import { useEffect, useMemo, useState } from 'react';
import { Cell, Row, useTable } from 'react-table';
import { fetchStatusesAPI } from 'http/statusAPI';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { ORDER_DETAIL_ROUTE } from 'constants/paths';
import { IOrder } from 'models/IOrder';
import { IStatus } from 'models/IStatus';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import OrderMenuCell from './OrderMenuCell';
import moment from 'moment';
import { DEF_FORMAT } from 'constants/app';
import OrdersToolbar from './OrdersToolbar/OrdersToolbar';
import styles from './OrdersTable.module.css';
import { orderSlice } from 'store/reducers/OrderSlice';
import { createNotificationAPI } from 'http/notificationAPI';
import socketio from 'socket/socketio';

const OrdersTable = () => {
  const [statuses, setStatuses] = useState<IStatus[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [page, setPage] = useState<number>(1);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const orders = useAppSelector((state) => state.order.orders);
  const activeStatus = useAppSelector((state) => state.order.activeStatus);
  const activeShop = useAppSelector((state) => state.app.activeShop);
  const user = useAppSelector((state) => state.user.user);
  const forceUpdate = useAppSelector((state) => state.order.forceUpdate);
  const ordersFilter = useAppSelector((state) => state.order.ordersFilter);
  const foundOrders = useAppSelector((state) => state.order.foundOrders);
  const isLoading = useAppSelector((state) => state.order.isLoading);

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
        Cell: ({ value }: Cell<IOrder>) => moment(value).format(DEF_FORMAT),
      },
      {
        Header: 'Услуги',
        style: { width: '100%' },
        accessor: (d: IOrder) => {
          const finishedProducts = d.finishedProducts?.filter(
            (elem, index, self) =>
              self.findIndex((t) => {
                return t.type.id === elem.type.id;
              }) === index
          );
          return finishedProducts
            .map(
              (element) =>
                `${element.product.name} ${element.type.name.toLowerCase()}`
            )
            .join(', ');
        },
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
          value === null ? 'Не указано' : moment(value).format(DEF_FORMAT),
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
    setPage(1);
    if (foundOrders.orderData.rows.length === 0) {
      if (foundOrders.searchText === '') {
        dispatch(orderSlice.actions.setForceUpdate(true));
        setIsNotFound(false);
      } else {
        setPageCount(1);
        setIsNotFound(true);
      }
    } else {
      dispatch(orderSlice.actions.setOrders(foundOrders.orderData.rows));
      const count = Math.ceil(foundOrders.orderData.count / limit);
      setPageCount(count);
      setIsNotFound(false);
    }
  }, [foundOrders]);

  useEffect(() => {
    setPage(1);
    if (ordersFilter.filter.isActive) {
      fetchWithFilters();
    } else {
      fetchOrders(1, [1, activeShop.id]);
    }
  }, [activeStatus]);

  useEffect(() => {
    if (ordersFilter.filter.isActive) {
      fetchWithFilters();
    } else if (ordersFilter.filter.isPendingDeactivation) {
      dispatch(orderSlice.actions.deactiveOrdersFilter());
      fetchOrders(page, [1, activeShop.id]);
    } else if (forceUpdate) {
      fetchOrders(page, [1, activeShop.id]);
    }

    dispatch(orderSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchOrders = (
    page: number,
    shopIds: number[],
    startDate?: string,
    endDate?: string,
    userId?: number
  ) => {
    if (!activeStatus) return;
    dispatch(orderSlice.actions.setIsLoading(true));

    fetchOrdersAPI(
      limit,
      page,
      activeStatus.id,
      shopIds,
      startDate,
      endDate,
      userId
    )
      .then((data) => {
        dispatch(orderSlice.actions.setOrders(data.rows));
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .finally(() => dispatch(orderSlice.actions.setIsLoading(false)));
  };

  const fetchStatuses = () => {
    fetchStatusesAPI().then((data) => {
      setStatuses(data);
    });
  };

  const fetchWithFilters = () => {
    const { shop, startDate, endDate, userId } = ordersFilter;
    fetchOrders(page, [shop.id], startDate, endDate, userId);
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    if (ordersFilter.filter.isActive) {
      fetchWithFilters();
    } else {
      fetchOrders(page, [1, activeShop.id]);
    }
  };

  const reload = () => {
    if (ordersFilter.filter.isActive) {
      fetchWithFilters();
    } else {
      fetchOrders(page, [1, activeShop.id]);
    }
  };

  const notifyStatusChange = (orderId: number, status: IStatus) => {
    const order = orders.find((order) => order.id === orderId);
    if (!order) return;
    if (order.orderMembers.length === 0) return;

    const orderMemberIds = [];
    for (let i = 0; i < order.orderMembers.length; i++) {
      orderMemberIds.push(order.orderMembers[i].user.id);
    }

    const oldStatusName = order.status?.name;

    const updatedOrder = { ...order, status };
    dispatch(orderSlice.actions.updateOrder(updatedOrder));

    const title = 'Изменен статус';
    const text = `${user?.name} изменил статус заказа № ${orderId} c "${oldStatusName}" на "${status.name}"`;

    createNotificationAPI(title, text, orderMemberIds).then((data) => {
      socketio.sendNotification(data);
    });
  };

  const updateStatus = (status: IStatus, order: IOrder) => {
    if (user) {
      const userId = user.id;
      updateStatusAPI(status.id, order.id, userId);

      notifyStatusChange(order.id, status);

      const updatedOrder = { ...order, status };
      socketio.updateOrder(updatedOrder);
    }
  };

  const rowClickHandler = (row: Row<IOrder>) => {
    navigate(ORDER_DETAIL_ROUTE, {
      state: { orderId: row.values.id },
    });
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: orders });

  return (
    <div style={{ height: '100%' }}>
      <OrdersToolbar setLimit={setLimit} reload={reload} />
      {isNotFound ? (
        <div className={[styles.container, styles.message].join(' ')}>
          Ничего не найдено
        </div>
      ) : (
        <div className={styles.container}>
          {isLoading ? (
            <Loader height="calc(100vh - 200px)" />
          ) : (
            <table {...getTableProps()} className={styles.section}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column: any) => (
                      <th
                        {...column.getHeaderProps()}
                        className={styles.column}
                        style={column.style}
                      >
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className={styles.row}
                      onClick={(e: any) =>
                        e.target.tagName === 'TD' && rowClickHandler(row)
                      }
                    >
                      {row.cells.map((cell: any) => {
                        const isStatus = cell.column.id === 'status';
                        const isDeadlinePass =
                          cell.column.id === 'deadline' &&
                          Date.parse(cell.value) < Date.now() &&
                          ['Новый', 'В работе'].includes(
                            row.original.status!.name
                          );

                        if (isStatus) {
                          return (
                            <td
                              {...cell.getCellProps()}
                              style={{ borderBottom: '1px solid #EEEDE8' }}
                            >
                              <StatusSelectButton
                                statuses={statuses}
                                changeHandler={(
                                  status: IStatus,
                                  order: IOrder
                                ) => updateStatus(status, order)}
                                defaultSelectedStatus={cell.value}
                                order={cell.row.original}
                                key={cell.row.original.id}
                              />
                            </td>
                          );
                        } else if (isDeadlinePass) {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className={styles.cell}
                              style={{ ...cell.column.style, color: '#FF7613' }}
                            >
                              {cell.render('Cell')}
                            </td>
                          );
                        } else {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className={styles.cell}
                              style={cell.column.style}
                            >
                              {cell.render('Cell')}
                            </td>
                          );
                        }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
      <div className={styles.pagination}>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Вперед"
          onPageChange={(e) => pageChangeHandler(e.selected + 1)}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="Назад"
          renderOnZeroPageCount={() => {}}
          containerClassName="pagination-container"
          pageLinkClassName="pagination-page"
          activeLinkClassName="pagination-active"
          previousLinkClassName="pagination-previous-next"
          nextLinkClassName="pagination-previous-next"
          disabledLinkClassName="pagination-disabled"
          breakLinkClassName="pagination-break"
          forcePage={page - 1}
        />
      </div>
    </div>
  );
};

export default OrdersTable;
