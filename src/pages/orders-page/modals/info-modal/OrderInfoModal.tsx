import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { IOrderInfo } from 'models/api/IOrderInfo';
import OrderInfoAPI from 'api/OrderInfoAPI/OrderInfoAPI';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { modalActions } from 'store/reducers/ModalSlice';
import { Table } from 'components';
import { orderInfoTableColumns } from './OrderInfoTable.colums';

const OrdersInfoModal = () => {
  const [orderInfos, setOrderInfos] = useState<IOrderInfo[]>([]);

  const { isOpen, order } = useAppSelector(
    (state) => state.modal.ordersInfoModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      OrderInfoAPI.getAll({ orderId: order?.id }).then((data) => {
        setOrderInfos(data.rows);
      });
    }
  }, [isOpen]);

  const closeModal = () => {
    dispatch(modalActions.closeModal('ordersInfoModal'));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      scrollBehavior="inside"
      size="md"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`О заказе № ${order?.id}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody px={0} maxH="450px">
          <Table columns={orderInfoTableColumns} data={orderInfos} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrdersInfoModal;
