import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useState } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { modalActions } from 'store/reducers/ModalSlice';
import * as Yup from 'yup';
import { SHOP_INVALID_MSG } from 'constants/app';
import { Field, FieldProps, Form, Formik } from 'formik';
import { SelectField } from 'components/ui/select/Select';
import OrderAPI from 'api/OrderAPI/OrderAPI';
import { orderActions } from 'store/reducers/OrderSlice';
import NotificationAPI from 'api/NotificationAPI/NotificationAPI';
import socketio from 'socket/socketio';
import { getEmployeeFullName } from 'helpers/employee';
import styles from './OrderShopModal.module.scss';

interface FormValues {
  shopId: number;
}

const INITIAL_FORM_STATE: FormValues = {
  shopId: 0,
};

const formSchema = Yup.object({
  shopId: Yup.number().min(1, SHOP_INVALID_MSG).required(SHOP_INVALID_MSG),
});

const OrderShopModal = () => {
  const [formState, setFormState] = useState<FormValues>(INITIAL_FORM_STATE);

  const { isOpen, order } = useAppSelector(
    (state) => state.modal.ordersShopModal
  );
  const shopsWithGeneral = useAppSelector(
    (state) => state.app.shopsWithGeneral
  );
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();

  const editShop = (values: FormValues) => {
    if (!order) return;
    const orderId = order.id;
    const shopId = values.shopId;
    OrderAPI.editShop({ orderId, shopId }).then(() => {
      dispatch(orderActions.setForceUpdate(true));
      closeModal();
      notifyShopUpdate(shopId);
    });
  };

  const notifyShopUpdate = (shopId: number) => {
    if (!order || !order.orderMembers?.length) return;
    const employeeIds: number[] = [];
    order.orderMembers.forEach((orderMember) => {
      employeeIds.push(orderMember.employee.id);
    });
    const shop = shopsWithGeneral.find((shop) => shop.id === shopId);
    const title = 'Заказ перемещен';
    const text = `${getEmployeeFullName(employee)} переместил заказ № ${
      order.id
    } c филиала «${order.shop?.name}» на «${shop?.name}»`;
    NotificationAPI.create({
      title,
      text,
      employeeIds,
      appId: 1,
      notificationCategoryId: 5,
    }).then((data) => {
      socketio.sendNotification(data, employeeIds);
    });
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('ordersShopModal'));
    setFormState(INITIAL_FORM_STATE);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`Перемещение заказа № ${order?.id}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={formState}
            validationSchema={formSchema}
            enableReinitialize
            onSubmit={editShop}
          >
            {() => (
              <Form className={styles.form}>
                <Field name="shopId">
                  {({ field, form, meta }: FieldProps) => (
                    <FormControl isInvalid={!!meta.error && meta.touched}>
                      <FormLabel>Филиал</FormLabel>
                      <SelectField
                        placeholder="Филиал"
                        options={shopsWithGeneral}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        fieldProps={field}
                        formProps={form}
                      />
                      <FormErrorMessage>{meta.error}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  className={styles.create_button}
                  type="submit"
                  colorScheme="yellow"
                >
                  Переместить
                </Button>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrderShopModal;
