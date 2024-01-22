import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IShop } from 'models/api/IShop';
import { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch,
} from '@chakra-ui/react';
import { ALL_SHOPS } from 'constants/initialStates';
import { modalActions } from 'store/reducers/ModalSlice';
import { DatePicker, PeriodSelect } from 'components';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { SelectField } from 'components/ui/select/Select';
import ShopAPI from 'api/ShopAPI/ShopAPI';
import { orderActions } from 'store/reducers/OrderSlice';
import { filterActions } from 'store/reducers/FilterSlice';
import styles from './OrdersFilterModal.module.scss';

export interface IOrdersFilterState {
  shopId: number;
  dates: [string, string];
  iOrderMember: boolean;
}

export const INITIAL_ORDERS_FILTER_STATE: IOrdersFilterState = {
  shopId: 0,
  dates: ['', ''],
  iOrderMember: false,
};

const OrdersFilterModal = () => {
  const [shops, setShops] = useState<IShop[]>([]);

  const { isOpen } = useAppSelector((state) => state.modal.ordersFilterModal);
  const filterState = useAppSelector((state) => state.order.filterState);
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      fetchShops();
    }
  }, [isOpen]);

  const fetchShops = () => {
    ShopAPI.getAll({ isIncludeGeneral: true }).then((data) => {
      setShops([ALL_SHOPS, ...data.rows]);
    });
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('ordersFilterModal'));
  };

  const reset = () => {
    dispatch(orderActions.setFilterState(INITIAL_ORDERS_FILTER_STATE));
  };

  const clear = () => {
    dispatch(orderActions.setForceUpdate(true));
    dispatch(filterActions.clearFilter('ordersFilter'));

    reset();
    closeModal();
  };

  const filter = (
    values: IOrdersFilterState,
    { setSubmitting }: FormikHelpers<IOrdersFilterState>
  ) => {
    if (!employee) return;
    const {
      shopId,
      dates: [startDate, endDate],
      iOrderMember,
    } = values;
    dispatch(orderActions.setFilterState(values));
    dispatch(orderActions.setForceUpdate(true));
    dispatch(
      filterActions.activeFilter({
        filter: 'ordersFilter',
        props: {
          shopIds: [shopId],
          startDate,
          endDate,
          employeeId: iOrderMember ? employee.id : undefined,
        },
      })
    );
    dispatch(orderActions.setSearch(''));
    setSubmitting(false);
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Фильтры заказов</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={filterState}
            enableReinitialize
            onSubmit={filter}
          >
            {(props) => (
              <Form className={styles.form}>
                <Field name="shopId">
                  {({ field, form }: FieldProps) => (
                    <FormControl>
                      <FormLabel>Филиал</FormLabel>
                      <SelectField
                        placeholder="Филиал"
                        options={shops}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        fieldProps={field}
                        formProps={form}
                        isDisabled={form.isSubmitting}
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="dates">
                  {({ field, form }: FieldProps) => (
                    <FormControl>
                      <PeriodSelect
                        label="Дата заказа"
                        onClick={(period) =>
                          form.setFieldValue('dates', [
                            period.startDate,
                            period.endDate,
                          ])
                        }
                      />
                      <DatePicker
                        placeholderText="Дата заказа"
                        startDate={field.value[0]}
                        endDate={field.value[1]}
                        selectsRange
                        isClearable
                        disabled={form.isSubmitting}
                        onChange={(startDate, endDate) =>
                          form.setFieldValue('dates', [startDate, endDate])
                        }
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="iOrderMember">
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      flexDirection="row"
                      display="flex"
                      alignItems="center"
                    >
                      <FormLabel mb={0}>Я участвую в заказе</FormLabel>
                      <Switch
                        {...field}
                        isChecked={field.value}
                        isDisabled={form.isSubmitting}
                      />
                    </FormControl>
                  )}
                </Field>
                <div className={styles.footer}>
                  <Button className={styles.footer_button} onClick={clear}>
                    Очистить
                  </Button>
                  <Button
                    className={styles.footer_button}
                    isLoading={props.isSubmitting}
                    type="submit"
                    colorScheme="yellow"
                  >
                    Готово
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrdersFilterModal;
