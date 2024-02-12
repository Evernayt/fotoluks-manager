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
import {
  APP_ID,
  ICON_SIZE,
  ICON_STROKE,
  MODES,
  NOTIF_CATEGORY_ID,
  UI_DATE_FORMAT,
} from 'constants/app';
import {
  calcSumWithDiscount,
  createOrderBodyForSave,
} from './OrderDetailPage.service';
import { Button, Card, CardBody, useToast } from '@chakra-ui/react';
import OrderCancelModal from './modals/cancel-modal/OrderCancelModal';
import OrderUnsavedDataModal from './modals/unsaved-data-modal/OrderUnsavedDataModal';
import { IconPlus } from '@tabler/icons-react';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import OrderEditProductModal from './modals/edit-product-modal/OrderEditProductModal';
import { modalActions } from 'store/reducers/ModalSlice';
import OrderProducts from './components/products/OrderProducts';
import { IOrderProduct } from 'models/api/IOrderProduct';
import OrderMembersModal from './modals/members-modal/OrderMembersModal';
import OrderClientEditModal from './modals/client-edit-modal/OrderClientEditModal';
import OrderMembersSidebar from './components/members-sidebar/OrderMembersSidebar';
import { getEmployeeShortName } from 'helpers/employee';
import { getErrorToast } from 'helpers/toast';
import { OrderReasonModal } from 'components';
import OrderFilesModal from './modals/files-modal/OrderFilesModal';
import { IFileForUpload } from 'models/IFileForUpload';
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
  const orderFilePathsForUpload = useAppSelector(
    (state) => state.order.orderFilePathsForUpload
  );
  const orderFilesForDelete = useAppSelector(
    (state) => state.order.orderFilesForDelete
  );

  const deferredSum = useDeferredValue(sum);

  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (state?.orderId) {
      fetchOrder(state.orderId);

      if (!employee) return;
      socketio.addOrderEditor({ employee, targetId: state.orderId });
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
        dispatch(orderActions.setOpenedOrderStatus(data.status || null));
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
      const text = `${getEmployeeShortName(
        employee
      )} добавил вас в участники заказа № ${order.id}`;

      NotificationAPI.create({
        title,
        text,
        employeeIds,
        appId: APP_ID.Заказы,
        notificationCategoryId:
          NOTIF_CATEGORY_ID.Добавлен_или_удален_из_участников,
      }).then((data) => {
        socketio.sendNotification(data, employeeIds);
      });
    }

    if (orderMembersForDelete.length > 0) {
      const title = 'Удален из участников';
      const text = `${getEmployeeShortName(
        employee
      )} удалил вас из участников заказа № ${order.id}`;

      NotificationAPI.create({
        title,
        text,
        employeeIds: orderMembersForDelete,
        appId: APP_ID.Заказы,
        notificationCategoryId:
          NOTIF_CATEGORY_ID.Добавлен_или_удален_из_участников,
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
      const text = `${getEmployeeShortName(employee)} изменил срок заказа № ${
        orderClone.id
      } с ${moment(beforeOrderClone.deadline).format(
        UI_DATE_FORMAT
      )} на ${moment(orderClone.deadline).format(UI_DATE_FORMAT)}`;

      NotificationAPI.create({
        title,
        text,
        employeeIds,
        appId: APP_ID.Заказы,
        notificationCategoryId: NOTIF_CATEGORY_ID.Изменен_заказ,
      }).then((data) => {
        socketio.sendNotification(data, employeeIds);
      });
    }
  };

  const saveOrder = () => {
    if (!haveUnsavedData) return;
    setIsLoading(true);

    if (orderFilePathsForUpload.length > 0) {
      window.electron.ipcRenderer.sendMessage(
        'get-files-for-upload',
        orderFilePathsForUpload
      );
      window.electron.ipcRenderer.once(
        'get-files-for-upload',
        (filesForUpload: IFileForUpload[]) => {
          createOrder(filesForUpload);
        }
      );
    } else {
      createOrder([]);
    }
  };

  const createOrder = (filesForUpload: IFileForUpload[]) => {
    if (!employee) return;
    const isOrderCreate = order.id === 0;
    //@ts-ignore
    const body = createOrderBodyForSave(
      orderProductsForCreate,
      orderProductsForUpdate,
      orderProductsForDelete,
      order,
      sum,
      employee.id,
      activeShop.id,
      orderMembersForCreate,
      orderMembersForDelete,
      //orderFilesForDelete
    );

    OrderAPI.create(body, filesForUpload)
      .then((data) => {
        dispatch(orderActions.setOrder(data.order));
        dispatch(orderActions.saveOrder(data.order));
        dispatch(orderActions.setHaveUnsavedData(false));

        socketio.updateOrder(data.order);

        if (isOrderCreate) {
          dispatch(
            orderActions.setOpenedOrderStatus(data.order.status || null)
          );
          socketio.addOrderEditor({ employee, targetId: data.order.id });
        }

        notifyMembersEdit(employee, data.order);
        notifyMembers(data.order, beforeOrder);
      })
      .catch((e) => toast(getErrorToast('OrderDetailPage.saveOrder', e)))
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
      <OrderNavbar isDisabled={isLoading} />
      <OrderFilesModal />
      <OrderReasonModal />
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
              <CardBody>
                <Button
                  leftIcon={<IconPlus size={ICON_SIZE} stroke={ICON_STROKE} />}
                  onClick={openEditProductModal}
                >
                  Добавить услугу
                </Button>
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
