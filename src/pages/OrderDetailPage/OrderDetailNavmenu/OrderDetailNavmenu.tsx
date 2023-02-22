import { Button, DetailNavmenu, DropdownButton } from 'components';
import { useNavigate } from 'react-router-dom';
import { IModal } from 'hooks/useModal';
import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { orderSlice } from 'store/reducers/OrderSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import socketio from 'socket/socketio';
import { IWatcher } from 'models/IWatcher';
import { DropdownButtonVariants } from 'components/UI/DropdownButton/DropdownButton';
import { Placements } from 'helpers/calcPlacement';
import OrderDetailWatchers from './OrderDetailWatchers/OrderDetailWatchers';

interface OrderDetailNavmenuProps {
  unsavedDataModal: IModal;
}

const OrderDetailNavmenu: FC<OrderDetailNavmenuProps> = ({
  unsavedDataModal,
}) => {
  const [orderWatchers, setOrderWatchers] = useState<IWatcher[]>([]);

  const order = useAppSelector((state) => state.order.order);
  const haveUnsavedData = useAppSelector(
    (state) => state.order.haveUnsavedData
  );
  const watchers = useAppSelector((state) => state.order.watchers);
  const employee = useAppSelector((state) => state.employee.employee);

  const title = order?.id === 0 ? 'Новый заказ' : `Заказ № ${order?.id}`;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (order.id !== 0) {
      const filteredWatchers = watchers.filter(
        (x) => x.orderId === order.id && x.employee.id !== employee?.id
      );
      setOrderWatchers(filteredWatchers);
    }
  }, [watchers, order.id]);

  const closeOrderDetail = () => {
    if (haveUnsavedData) {
      openUnsavedDataModal();
    } else {
      dispatch(orderSlice.actions.clearOrder());
      navigate(-1);

      if (employee) {
        socketio.removeWatcher(employee.id);
      }
    }
  };

  const openUnsavedDataModal = () => {
    unsavedDataModal.toggle();
  };

  const openMembersModal = () => {
    dispatch(modalSlice.actions.openModal({ modal: 'orderMembersModal' }));
  };

  const rightSection = () => {
    return (
      <>
        {orderWatchers.length > 0 && (
          <DropdownButton
            placement={Placements.bottomEnd}
            text={`Смотрят: ${orderWatchers.length}`}
            variant={DropdownButtonVariants.primaryDeemphasized}
            itemRender={() => <OrderDetailWatchers watchers={orderWatchers} />}
          />
        )}
        <Button onClick={openMembersModal}>
          Участники: {order.orderMembers?.length || 0}
        </Button>
      </>
    );
  };

  return (
    <DetailNavmenu
      title={title}
      onClose={closeOrderDetail}
      rightSection={rightSection()}
    />
  );
};

export default OrderDetailNavmenu;
