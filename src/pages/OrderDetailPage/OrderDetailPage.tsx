import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import OrderDetailServiceModal from './Modals/OrderDetailServiceModal/OrderDetailServiceModal';
import OrderDetailNavmenu from './OrderDetailNavmenu/OrderDetailNavmenu';
import OrderDetailService from './OrderDetailService/OrderDetailService';
import OrderDetailSidemenu from './OrderDetailSidemenu/OrderDetailSidemenu';
import { useModal } from 'hooks';
import OrderDetailCancelModal from './Modals/OrderDetailCancelModal/OrderDetailCancelModal';
import OrderDetailUnsavedDataModal from './Modals/OrderDetailUnsavedDataModal/OrderDetailUnsavedDataModal';
import { createClone, createOrderBodyForSave } from 'helpers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchOrderAPI, saveOrderAPI } from 'http/orderAPI';
import { IFinishedProduct } from 'models/IFinishedProduct';
import { DEF_FORMAT, Modes } from 'constants/app';
import { IOrder } from 'models/IOrder';
import UserRegistrationModal from './Modals/UserRegistrationModal/UserRegistrationModal';
import EditUserModal from 'components/UserCard/EditUserModal/EditUserModal';
import styles from './OrderDetailPage.module.css';
import { orderSlice } from 'store/reducers/OrderSlice';
import OrderDetailMembersModal from './Modals/OrderDetailMembersModal/OrderDetailMembersModal';
import { createNotificationAPI } from 'http/notificationAPI';
import { IUser } from 'models/IUser';
import moment from 'moment';
import socketio from 'socket/socketio';
import OrderDetailFavorites from './OrderDetailFavorites/OrderDetailFavorites';
import OrderDetailAddFavoriteModal from './Modals/OrderDetailAddFavoriteModal/OrderDetailAddFavoriteModal';
import { Loader } from 'components';

type LocationState = {
  state: {
    orderId: number;
  };
};

const OrderDetailPage = () => {
  const location = useLocation();
  const { state } = location as LocationState;

  const [sum, setSum] = useState<number>(0);
  const [serviceModalMode, setServiceModalMode] = useState<Modes>(
    Modes.ADD_MODE
  );
  const [serviceModalData, setServiceModalData] =
    useState<IFinishedProduct | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const serviceModal = useModal();
  const cancelOrderModal = useModal();
  const unsavedDataModal = useModal();

  const finishedProducts = useAppSelector(
    (state) => state.order.order?.finishedProducts
  );
  const finishedProductsForCreate = useAppSelector(
    (state) => state.order.finishedProductsForCreate
  );
  const finishedProductsForUpdate = useAppSelector(
    (state) => state.order.finishedProductsForUpdate
  );
  const finishedProductsForDelete = useAppSelector(
    (state) => state.order.finishedProductsForDelete
  );
  const haveUnsavedData = useAppSelector(
    (state) => state.order.haveUnsavedData
  );
  const order = useAppSelector((state) => state.order.order);
  const beforeOrder = useAppSelector((state) => state.order.beforeOrder);
  const user = useAppSelector((state) => state.user.user);
  const activeShop = useAppSelector((state) => state.app.activeShop);
  const orderMembersForCreate = useAppSelector(
    (state) => state.order.orderMembersForCreate
  );
  const orderMembersForDelete = useAppSelector(
    (state) => state.order.orderMembersForDelete
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (state?.orderId !== undefined) {
      fetchOrder(state.orderId);
    }
  }, []);

  useEffect(() => {
    setSum(0);
    finishedProducts?.forEach((finishedProduct) => {
      setSum(
        (prevState) =>
          prevState + finishedProduct.price * finishedProduct.quantity
      );
    });
  }, [finishedProducts]);

  const fetchOrder = (orderId: number) => {
    setIsLoading(true);
    fetchOrderAPI(orderId)
      .then((data) => {
        dispatch(orderSlice.actions.setBeforeOrder(data));
        dispatch(orderSlice.actions.setOrder(data));
      })
      .finally(() => setIsLoading(false));
  };

  const openServiceModal = (
    mode: Modes,
    finishedProduct: IFinishedProduct | null
  ) => {
    setServiceModalMode(mode);
    setServiceModalData(finishedProduct);
    serviceModal.toggle();
  };

  const notifyMembersEdit = (user: IUser, order: IOrder) => {
    if (orderMembersForCreate.length > 0) {
      const userIds = [];

      for (let i = 0; i < orderMembersForCreate.length; i++) {
        userIds.push(orderMembersForCreate[i].user.id);
      }

      const title = 'Добавлен в участники';
      const text = `${user.name} добавил вас в участники заказа № ${order.id}`;

      createNotificationAPI(title, text, userIds).then((data) => {
        socketio.sendNotification(data);
      });
    }

    if (orderMembersForDelete.length > 0) {
      const title = 'Удален из участников';
      const text = `${user.name} удалил вас из участников заказа № ${order.id}`;

      createNotificationAPI(title, text, orderMembersForDelete).then((data) => {
        socketio.sendNotification(data);
      });
    }
  };

  const notifyMembers = (orderClone: IOrder, beforeOrderClone: IOrder) => {
    if (orderClone.id === 0) return;
    if (orderClone.orderMembers.length === 0) return;

    const orderMembersIds = [];
    for (let i = 0; i < orderClone.orderMembers.length; i++) {
      orderMembersIds.push(orderClone.orderMembers[i].user.id);
    }

    if (orderClone.deadline !== beforeOrderClone.deadline) {
      const title = 'Изменен срок заказа';
      const text = `${user?.name} изменил срок заказа № ${
        orderClone.id
      } с ${moment(beforeOrderClone.deadline).format(DEF_FORMAT)} на ${moment(
        orderClone.deadline
      ).format(DEF_FORMAT)}`;

      createNotificationAPI(title, text, orderMembersIds).then((data) => {
        socketio.sendNotification(data);
      });
    }
  };

  const saveOrder = () => {
    if (!haveUnsavedData) {
      return;
    }

    if (!user) return;

    setIsLoading(true);

    const body = createOrderBodyForSave(
      finishedProductsForCreate,
      finishedProductsForUpdate,
      finishedProductsForDelete,
      order,
      sum,
      user.id,
      activeShop.id,
      orderMembersForCreate,
      orderMembersForDelete
    );

    saveOrderAPI(body)
      .then((data) => {
        let orderClone: IOrder = createClone(order);
        const beforeOrderClone: IOrder = createClone(beforeOrder);

        if (data.finishedProducts.length > 0) {
          orderClone = {
            ...orderClone,
            finishedProducts: data.finishedProducts,
          };
        }
        if (data.order) {
          orderClone = { ...orderClone, id: data.order.id };
        }

        dispatch(orderSlice.actions.setOrder(orderClone));
        dispatch(orderSlice.actions.saveOrder(orderClone));
        dispatch(orderSlice.actions.setHaveUnsavedData(false));

        notifyMembersEdit(user, data.order);
        notifyMembers(orderClone, beforeOrderClone);

        socketio.updateOrder(data.order);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className={styles.container}>
      {serviceModal.isShowing && (
        <OrderDetailServiceModal
          isShowing={serviceModal.isShowing}
          hide={serviceModal.toggle}
          mode={serviceModalMode}
          finishedProduct={serviceModalData}
        />
      )}
      {cancelOrderModal.isShowing && (
        <OrderDetailCancelModal
          isShowing={cancelOrderModal.isShowing}
          hide={cancelOrderModal.toggle}
        />
      )}
      {unsavedDataModal.isShowing && (
        <OrderDetailUnsavedDataModal
          isShowing={unsavedDataModal.isShowing}
          hide={unsavedDataModal.toggle}
          saveOrder={saveOrder}
        />
      )}
      <UserRegistrationModal />
      <EditUserModal />
      <OrderDetailMembersModal />
      <OrderDetailAddFavoriteModal />
      <OrderDetailNavmenu unsavedDataModal={unsavedDataModal} />
      {isLoading && (
        <div className={styles.loader}>
          <Loader />
        </div>
      )}
      <div className={styles.section}>
        <OrderDetailSidemenu
          sum={sum}
          cancelOrderModal={cancelOrderModal}
          saveOrder={saveOrder}
        />
        <div className={styles.cards}>
          <div className={styles.add_card}>
            <div
              className={styles.open_btn}
              onClick={() => openServiceModal(Modes.ADD_MODE, null)}
            >
              Какую услугу добавить?
            </div>
            <div className="separator" />
            <OrderDetailFavorites />
          </div>
          <div className={styles.services_section}>
            <div className={styles.services_cards}>
              {finishedProducts.map((finishedProduct) => (
                <OrderDetailService
                  finishedProduct={finishedProduct}
                  openServiceModal={openServiceModal}
                  key={finishedProduct.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
