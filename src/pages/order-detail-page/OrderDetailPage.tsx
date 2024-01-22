import { useLocation } from 'react-router-dom';
import OrderNavbar from './components/detail-navbar/OrderNavbar';
import OrderSidebar from './components/sidebar/OrderSidebar';
import { useDeferredValue, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import socketio from 'socket/socketio';
import OrderAPI from 'api/OrderAPI/OrderAPI';
import { orderActions } from 'store/reducers/OrderSlice';
import { IEmployee } from 'models/api/IEmployee';
import { IOrder } from 'models/api/IOrder';
import NotificationAPI from 'api/NotificationAPI/NotificationAPI';
import moment from 'moment';
import { ICON_SIZE, ICON_STROKE, MODES, UI_DATE_FORMAT } from 'constants/app';
import {
  calcSumWithDiscount,
  createOrderBodyForSave,
} from './OrderDetailPage.service';
import { createClone } from 'helpers';
import { Button, Card, CardBody, useToast } from '@chakra-ui/react';
import OrderCancelModal from './modals/cancel-modal/OrderCancelModal';
import OrderUnsavedDataModal from './modals/unsaved-data-modal/OrderUnsavedDataModal';
import OrderFavorites from './components/favorites/OrderFavorites';
import { IconPlus } from '@tabler/icons-react';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import OrderEditProductModal from './modals/edit-product-modal/OrderEditProductModal';
import { modalActions } from 'store/reducers/ModalSlice';
import OrderProducts from './components/products/OrderProducts';
import { IOrderProduct } from 'models/api/IOrderProduct';
import OrderMembersModal from './modals/members-modal/OrderMembersModal';
import OrderClientEditModal from './modals/client-edit-modal/OrderClientEditModal';
import OrderMembersSidebar from './components/members-sidebar/OrderMembersSidebar';
import { getEmployeeFullName } from 'helpers/employee';
import styles from './OrderDetailPage.module.scss';

type LocationState = {
  state: {
    orderId: number;
  };
};

const OrderDetailPage = () => {
  const location = useLocation();
  const { state } = location as LocationState;

  const [sum, setSum] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const orderProducts = useAppSelector(
    (state) => state.order.order?.orderProducts
  );
  const orderProductsForCreate = useAppSelector(
    (state) => state.order.orderProductsForCreate
  );
  const orderProductsForUpdate = useAppSelector(
    (state) => state.order.orderProductsForUpdate
  );
  const orderProductsForDelete = useAppSelector(
    (state) => state.order.orderProductsForDelete
  );
  const haveUnsavedData = useAppSelector(
    (state) => state.order.haveUnsavedData
  );
  const order = useAppSelector((state) => state.order.order);
  const beforeOrder = useAppSelector((state) => state.order.beforeOrder);
  const discount = useAppSelector((state) => state.order.order.discount);
  const employee = useAppSelector((state) => state.employee.employee);
  const activeShop = useAppSelector((state) => state.app.activeShop);
  const orderMembersForCreate = useAppSelector(
    (state) => state.order.orderMembersForCreate
  );
  const orderMembersForDelete = useAppSelector(
    (state) => state.order.orderMembersForDelete
  );

  const deferredSum = useDeferredValue(sum);

  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (state?.orderId) {
      fetchOrder(state.orderId);

      if (employee) {
        socketio.addWatcher({ employee, orderId: state.orderId });
      }
    }
  }, []);

  useEffect(() => {
    const sumWithDiscount =
      orderProducts?.reduce(
        (partialSum, orderProduct) =>
          partialSum + calcPriceWithDiscount(orderProduct),
        0
      ) || 0;
    setSum(Math.floor(sumWithDiscount));
  }, [orderProducts, discount]);

  const calcPriceWithDiscount = (orderProduct: IOrderProduct) => {
    const currectDiscount = orderProduct.product?.discountProhibited
      ? 0
      : orderProduct.discount || discount;
    return calcSumWithDiscount(
      currectDiscount,
      orderProduct.quantity,
      orderProduct.price
    );
  };

  const fetchOrder = (orderId: number) => {
    setIsLoading(true);
    OrderAPI.getOne(orderId)
      .then((data) => {
        dispatch(orderActions.setBeforeOrder(data));
        dispatch(orderActions.setOrder(data));
      })
      .finally(() => setIsLoading(false));
  };

  const notifyMembersEdit = (employee: IEmployee, order: IOrder) => {
    if (orderMembersForCreate.length > 0) {
      const employeeIds: number[] = [];
      orderMembersForCreate.forEach((orderMember) => {
        employeeIds.push(orderMember.employee.id);
      });

      const title = 'Добавлен в участники';
      const text = `${getEmployeeFullName(
        employee
      )} добавил вас в участники заказа № ${order.id}`;

      NotificationAPI.create({
        title,
        text,
        employeeIds,
        appId: 1,
        notificationCategoryId: 1,
      }).then((data) => {
        socketio.sendNotification(data, employeeIds);
      });
    }

    if (orderMembersForDelete.length > 0) {
      const title = 'Удален из участников';
      const text = `${getEmployeeFullName(
        employee
      )} удалил вас из участников заказа № ${order.id}`;

      NotificationAPI.create({
        title,
        text,
        employeeIds: orderMembersForDelete,
        appId: 1,
        notificationCategoryId: 1,
      }).then((data) => {
        socketio.sendNotification(data, orderMembersForDelete);
      });
    }
  };

  const notifyMembers = (orderClone: IOrder, beforeOrderClone: IOrder) => {
    if (orderClone.id === 0) return;
    if (!orderClone.orderMembers?.length) return;

    const employeeIds: number[] = [];
    orderClone.orderMembers.forEach((orderMember) => {
      employeeIds.push(orderMember.employee.id);
    });

    if (orderClone.deadline !== beforeOrderClone.deadline) {
      const title = 'Изменен срок заказа';
      const text = `${getEmployeeFullName(employee)} изменил срок заказа № ${
        orderClone.id
      } с ${moment(beforeOrderClone.deadline).format(
        UI_DATE_FORMAT
      )} на ${moment(orderClone.deadline).format(UI_DATE_FORMAT)}`;

      NotificationAPI.create({
        title,
        text,
        employeeIds,
        appId: 1,
        notificationCategoryId: 5,
      }).then((data) => {
        socketio.sendNotification(data, employeeIds);
      });
    }
  };

  const saveOrder = () => {
    if (!haveUnsavedData) {
      return;
    }

    if (!employee) return;

    setIsLoading(true);

    const isOrderCreate = order !== null;

    const body = createOrderBodyForSave(
      orderProductsForCreate,
      orderProductsForUpdate,
      orderProductsForDelete,
      order,
      sum,
      employee.id,
      activeShop.id,
      orderMembersForCreate,
      orderMembersForDelete
    );

    OrderAPI.create(body)
      .then((data) => {
        if (!order || !beforeOrder) return;
        let orderClone: IOrder = createClone(order);
        const beforeOrderClone: IOrder = createClone(beforeOrder);

        if (data.orderProducts.length > 0) {
          orderClone = {
            ...orderClone,
            orderProducts: data.orderProducts,
          };
        }
        if (data.order) {
          orderClone = { ...orderClone, id: data.order.id };
        }

        dispatch(orderActions.setOrder(orderClone));
        dispatch(orderActions.saveOrder(orderClone));
        dispatch(orderActions.setHaveUnsavedData(false));

        notifyMembersEdit(employee, data.order);
        notifyMembers(orderClone, beforeOrderClone);

        socketio.updateOrder(data.order);

        if (isOrderCreate) {
          socketio.addWatcher({ employee, orderId: data.order.id });
        }
      })
      .catch((e) =>
        toast({
          title: 'OrderDetailPage.saveOrder',
          description: e.response.data ? e.response.data.message : e.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      )
      .finally(() => setIsLoading(false));
  };

  const openEditProductModal = () => {
    dispatch(
      modalActions.openModal({
        modal: 'orderProductEditModal',
        props: { mode: MODES.ADD_MODE },
      })
    );
  };

  return (
    <>
      <OrderNavbar />
      <OrderMembersModal />
      <OrderClientEditModal />
      <OrderCancelModal />
      <OrderUnsavedDataModal saveOrder={saveOrder} />
      <OrderEditProductModal />
      <LoaderWrapper isLoading={isLoading} width="100%" height="100%">
        <div className={styles.container}>
          <OrderSidebar sum={deferredSum} saveOrder={saveOrder} />
          <div className={styles.cards}>
            <Card>
              <CardBody display="flex">
                <Button
                  leftIcon={<IconPlus size={ICON_SIZE} stroke={ICON_STROKE} />}
                  onClick={openEditProductModal}
                >
                  Добавить услугу
                </Button>
                <OrderFavorites />
              </CardBody>
            </Card>
            <OrderProducts />
          </div>
          <OrderMembersSidebar />
        </div>
      </LoaderWrapper>
    </>
  );
};

export default OrderDetailPage;
