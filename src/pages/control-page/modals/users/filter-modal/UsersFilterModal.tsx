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
import styles from './UsersFilterModal.module.scss';

export interface IUsersFilterState {
  archive: boolean;
}

export const INITIAL_USERS_FILTER_STATE: IUsersFilterState = {
  archive: false,
};

const UsersFilterModal = () => {
  const { isOpen } = useAppSelector((state) => state.modal.usersFilterModal);
  const filterState = useAppSelector((state) => state.control.usersFilterState);

  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(modalActions.closeModal('usersFilterModal'));
  };

  const reset = () => {
    dispatch(controlActions.setUsersFilterState(INITIAL_USERS_FILTER_STATE));
  };

  const clear = () => {
    dispatch(controlActions.setForceUpdate(true));
    dispatch(filterActions.clearFilter('usersFilter'));

    reset();
    closeModal();
  };

  const filter = (
    values: IUsersFilterState,
    { setSubmitting }: FormikHelpers<IUsersFilterState>
  ) => {
    const { archive } = values;
    dispatch(controlActions.setUsersFilterState(values));
    dispatch(controlActions.setForceUpdate(true));
    dispatch(
      filterActions.activeFilter({
        filter: 'usersFilter',
        props: { archive },
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
        <ModalHeader>Фильтры клиентов</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={filterState}
            enableReinitialize
            onSubmit={filter}
          >
            {(props) => (
              <Form className={styles.form}>
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

export default UsersFilterModal;
