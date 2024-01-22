import DepartmentAPI from 'api/DepartmentAPI/DepartmentAPI';
import ShopAPI from 'api/ShopAPI/ShopAPI';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IDepartment } from 'models/api/IDepartment';
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
import { ALL_DEPARTMENTS, ALL_SHOPS } from 'constants/initialStates';
import { modalActions } from 'store/reducers/ModalSlice';
import { taskActions } from 'store/reducers/TaskSlice';
import { filterActions } from 'store/reducers/FilterSlice';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { SelectField } from 'components/ui/select/Select';
import { DatePicker, PeriodSelect } from 'components';
import styles from './TasksFilterModal.module.scss';

export interface ITasksFilterState {
  shopId: number;
  departmentId: number;
  dates: [string, string];
  iTaskMember: boolean;
  iTaskCreator: boolean;
  urgent: boolean;
  archive: boolean;
}

export const INITIAL_TASKS_FILTER_STATE: ITasksFilterState = {
  shopId: 0,
  departmentId: 0,
  dates: ['', ''],
  iTaskMember: false,
  iTaskCreator: false,
  urgent: false,
  archive: false,
};

const TasksFilterModal = () => {
  const [shops, setShops] = useState<IShop[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);

  const { isOpen } = useAppSelector((state) => state.modal.tasksFilterModal);
  const filterState = useAppSelector((state) => state.task.filterState);
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      fetchShops();
      fetchDepartments();
    }
  }, [isOpen]);

  const fetchShops = () => {
    ShopAPI.getAll({ isIncludeGeneral: true }).then((data) => {
      setShops([ALL_SHOPS, ...data.rows]);
    });
  };

  const fetchDepartments = () => {
    DepartmentAPI.getAll({ isIncludeGeneral: true }).then((data) => {
      setDepartments([ALL_DEPARTMENTS, ...data.rows]);
    });
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('tasksFilterModal'));
  };

  const reset = () => {
    dispatch(taskActions.setFilterState(INITIAL_TASKS_FILTER_STATE));
  };

  const clear = () => {
    dispatch(taskActions.setForceUpdate(true));
    dispatch(filterActions.clearFilter('tasksFilter'));

    reset();
    closeModal();
  };

  const filter = (
    values: ITasksFilterState,
    { setSubmitting }: FormikHelpers<ITasksFilterState>
  ) => {
    const {
      shopId,
      departmentId,
      dates: [startDate, endDate],
      iTaskMember,
      iTaskCreator,
      urgent,
      archive,
    } = values;
    dispatch(taskActions.setFilterState(values));
    dispatch(taskActions.setForceUpdate(true));
    dispatch(
      filterActions.activeFilter({
        filter: 'tasksFilter',
        props: {
          shopIds: [shopId],
          departmentIds: [departmentId],
          startDate,
          endDate,
          employeeId: iTaskMember ? employee?.id : undefined,
          creatorId: iTaskCreator ? employee?.id : undefined,
          urgent,
          archive,
        },
      })
    );
    dispatch(taskActions.setSearch(''));
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
                <Field name="departmentId">
                  {({ field, form }: FieldProps) => (
                    <FormControl>
                      <FormLabel>Отдел</FormLabel>
                      <SelectField
                        placeholder="Отдел"
                        options={departments}
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
                        label="Дата задачи"
                        onClick={(period) =>
                          form.setFieldValue('dates', [
                            period.startDate,
                            period.endDate,
                          ])
                        }
                      />
                      <DatePicker
                        placeholderText="Дата задачи"
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
                <Field name="iTaskMember">
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      flexDirection="row"
                      display="flex"
                      alignItems="center"
                    >
                      <FormLabel mb={0}>Я участвую в задаче</FormLabel>
                      <Switch
                        {...field}
                        isChecked={field.value}
                        isDisabled={form.isSubmitting}
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="iTaskCreator">
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      flexDirection="row"
                      display="flex"
                      alignItems="center"
                    >
                      <FormLabel mb={0}>Я создатель задачи</FormLabel>
                      <Switch
                        {...field}
                        isChecked={field.value}
                        isDisabled={form.isSubmitting}
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="urgent">
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      flexDirection="row"
                      display="flex"
                      alignItems="center"
                    >
                      <FormLabel mb={0}>Срочная задача</FormLabel>
                      <Switch
                        {...field}
                        isChecked={field.value}
                        isDisabled={form.isSubmitting}
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="archive">
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      flexDirection="row"
                      display="flex"
                      alignItems="center"
                    >
                      <FormLabel mb={0}>В архиве</FormLabel>
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

export default TasksFilterModal;
