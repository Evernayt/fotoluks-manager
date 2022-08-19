import { Modal } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchOrderInfosAPI } from 'http/orderInfoAPI';
import { IOrderInfo } from 'models/IOrderInfo';
import { useEffect, useMemo, useState } from 'react';
import { useTable } from 'react-table';
import moment from 'moment';
import { DEF_FORMAT } from 'constants/app';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './OrderInfoModal.module.css';

const OrderInfoModal = () => {
  const [orderInfos, setOrderInfos] = useState<IOrderInfo[]>([]);

  const orderInfoModal = useAppSelector((state) => state.modal.orderInfoModal);

  const dispatch = useAppDispatch();

  const columns = useMemo<any>(
    () => [
      {
        Header: 'Дата изменения',
        accessor: 'createdAt',
        style: { minWidth: '110px' },
        Cell: ({ value }: any) => moment(value).format(DEF_FORMAT),
      },
      {
        Header: 'Статус',
        accessor: 'status',
        Cell: ({ value }: any) => value.name,
      },
      {
        Header: 'Сотрудник',
        accessor: 'user.name',
      },
    ],
    []
  );

  useEffect(() => {
    if (orderInfoModal.order) {
      fetchOrderInfosAPI(orderInfoModal.order.id).then((data) => {
        setOrderInfos(data);
      });
    }
  }, [orderInfoModal]);

  const close = () => {
    dispatch(modalSlice.actions.closeOrderInfoModal());
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: orderInfos });

  return (
    <Modal
      title={'О заказе № ' + orderInfoModal.order?.id}
      isShowing={orderInfoModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
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
                <tr {...row.getRowProps()} className={styles.row}>
                  {row.cells.map((cell: any) => (
                    <td
                      {...cell.getCellProps()}
                      className={styles.cell}
                      style={cell.column.style}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default OrderInfoModal;
