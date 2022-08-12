import { IconButton } from 'components';
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
import { ADD_MODE } from 'constants/app';
import { IconButtonVariants } from 'components/UI/IconButton/IconButton';
import { IOrder } from 'models/IOrder';
import UserRegistrationModal from './Modals/UserRegistrationModal/UserRegistrationModal';
import EditUserModal from 'components/UserCard/EditUserModal/EditUserModal';
import styles from './OrderDetailPage.module.css';
import { orderSlice } from 'store/reducers/OrderSlice';
import OrderDetailMembersModal from './Modals/OrderDetailMembersModal/OrderDetailMembersModal';

type LocationState = {
  state: {
    orderId: number;
  };
};

const OrderDetailPage = () => {
  const location = useLocation();
  const { state } = location as LocationState;

  const [sum, setSum] = useState<number>(0);
  const [serviceModalMode, setServiceModalMode] = useState(ADD_MODE);
  const [serviceModalData, setServiceModalData] =
    useState<IFinishedProduct | null>(null);

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
    fetchOrderAPI(orderId).then((data) => {
      dispatch(orderSlice.actions.setBeforeOrder(data));
      dispatch(orderSlice.actions.setOrder(data));
    });
  };

  const openServiceModal = (
    mode: string,
    finishedProduct: IFinishedProduct | null
  ) => {
    setServiceModalMode(mode);
    setServiceModalData(finishedProduct);
    serviceModal.toggle();
  };

  const saveOrder = () => {
    if (!haveUnsavedData) {
      return;
    }

    if (!user) return;

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

    saveOrderAPI(body).then((data) => {
      let orderClone: IOrder = createClone(order);

      if (data.finishedProducts.length > 0) {
        orderClone = { ...orderClone, finishedProducts: data.finishedProducts };
      }
      if (data.order) {
        orderClone = { ...orderClone, id: data.order.id };
      }

      dispatch(orderSlice.actions.setOrder(orderClone));
      dispatch(orderSlice.actions.saveOrder(orderClone));
      dispatch(orderSlice.actions.setHaveUnsavedData(false));
    });
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
      <OrderDetailNavmenu unsavedDataModal={unsavedDataModal} />
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
              onClick={() => openServiceModal(ADD_MODE, null)}
            >
              Какую услугу добавить?
            </div>
            <div className="separator" />
            <div className={styles.favorites}>
              <IconButton
                variant={IconButtonVariants.link}
                icon="https://www.pichshop.ru/product_img/632221/b1.jpg"
                style={{ marginRight: '12px' }}
              >
                Кружка цветная внутри красная
              </IconButton>
              <IconButton
                variant={IconButtonVariants.link}
                icon="https://www.pichshop.ru/product_img/632221/b1.jpg"
                style={{ marginRight: '12px' }}
              >
                Кружка цветная внутри красная
              </IconButton>
              <IconButton
                variant={IconButtonVariants.link}
                icon="https://www.pichshop.ru/product_img/632221/b1.jpg"
                style={{ marginRight: '12px' }}
              >
                Кружка цветная внутри красная
              </IconButton>
              <IconButton
                variant={IconButtonVariants.link}
                icon="https://www.pichshop.ru/product_img/632221/b1.jpg"
                style={{ marginRight: '12px' }}
              >
                Кружка цветная внутри красная
              </IconButton>
            </div>
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
