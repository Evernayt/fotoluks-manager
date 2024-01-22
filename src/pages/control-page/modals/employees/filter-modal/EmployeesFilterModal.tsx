import { useAppDispatch, useAppSelector } from 'hooks/redux';
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
import { modalActions } from 'store/reducers/ModalSlice';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { filterActions } from 'store/reducers/FilterSlice';
import { controlActions } from 'store/reducers/ControlSlice';
import { SelectField } from 'components/ui/select/Select';
import { useEffect, useState } from 'react';
import { IRole } from 'models/api/IRole';
import RoleAPI from 'api/RoleAPI/RoleAPI';
import { ALL_ROLES } from 'constants/initialStates';
import styles from './EmployeesFilterModal.module.scss';

export interface IEmployeesFilterState {
  archive: boolean;
  roleId: number;
}

export const INITIAL_EMPLOYEES_FILTER_STATE: IEmployeesFilterState = {
  archive: false,
  roleId: 0,
};

const EmployeesFilterModal = () => {
  const [roles, setRoles] = useState<IRole[]>([]);

  const { isOpen } = useAppSelector(
    (state) => state.modal.employeesFilterModal
  );
  const filterState = useAppSelector(
    (state) => state.control.employeesFilterState
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  const fetchRoles = () => {
    RoleAPI.getAll().then((data) => {
      setRoles([ALL_ROLES, ...data.rows]);
    });
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('employeesFilterModal'));
  };

  const reset = () => {
    dispatch(
      controlActions.setEmployeesFilterState(INITIAL_EMPLOYEES_FILTER_STATE)
    );
  };

  const clear = () => {
    dispatch(controlActions.setForceUpdate(true));
    dispatch(filterActions.clearFilter('employeesFilter'));

    reset();
    closeModal();
  };

  const filter = (
    values: IEmployeesFilterState,
    { setSubmitting }: FormikHelpers<IEmployeesFilterState>
  ) => {
    const { archive, roleId } = values;
    dispatch(controlActions.setEmployeesFilterState(values));
    dispatch(controlActions.setForceUpdate(true));
    dispatch(
      filterActions.activeFilter({
        filter: 'employeesFilter',
        props: { archive, roleIds: [roleId] },
      })
    );
    dispatch(controlActions.setSearch(''));
    setSubmitting(false);
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Фильтры сотрудников</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={filterState}
            enableReinitialize
            onSubmit={filter}
          >
            {(props) => (
              <Form className={styles.form}>
                <Field name="roleId">
                  {({ field, form }: FieldProps) => (
                    <FormControl>
                      <FormLabel>Роль</FormLabel>
                      <SelectField
                        placeholder="Роль"
                        options={roles}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        fieldProps={field}
                        formProps={form}
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

export default EmployeesFilterModal;
