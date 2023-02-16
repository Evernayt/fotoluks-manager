import { Modal, Table } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { DEF_DATE_FORMAT } from 'constants/app';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './OrderInfoModal.module.scss';
import { IOrderInfo } from 'models/api/IOrderInfo';
import OrderInfoAPI from 'api/OrderInfoAPI/OrderInfoAPI';

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
        Cell: ({ value }: any) => moment(value).format(DEF_DATE_FORMAT),
      },
      {
        Header: 'Статус',
        accessor: 'status',
        Cell: ({ value }: any) => value.name,
      },
      {
        Header: 'Сотрудник',
        accessor: 'employee.name',
      },
    ],
    []
  );

  useEffect(() => {
    if (orderInfoModal.order) {
      const orderId = orderInfoModal.order.id;
      OrderInfoAPI.getAll({ orderId }).then((data) => {
        setOrderInfos(data.rows);
      });
    }
  }, [orderInfoModal]);

  const close = () => {
    dispatch(modalSlice.actions.closeModal('orderInfoModal'));
  };

  return (
    <Modal
      title={'О заказе № ' + orderInfoModal.order?.id}
      isShowing={orderInfoModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        <Table columns={columns} data={orderInfos} isHaveToolbar={false} />
      </div>
    </Modal>
  );
};

export default OrderInfoModal;
