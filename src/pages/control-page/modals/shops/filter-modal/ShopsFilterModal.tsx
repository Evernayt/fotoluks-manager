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
import styles from './ShopsFilterModal.module.scss';

export interface IShopsFilterState {
  archive: boolean;
}

export const INITIAL_SHOPS_FILTER_STATE: IShopsFilterState = {
  archive: false,
};

const ShopsFilterModal = () => {
  const { isOpen } = useAppSelector((state) => state.modal.shopsFilterModal);
  const filterState = useAppSelector((state) => state.control.shopsFilterState);

  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(modalActions.closeModal('shopsFilterModal'));
  };

  const reset = () => {
    dispatch(controlActions.setShopsFilterState(INITIAL_SHOPS_FILTER_STATE));
  };

  const clear = () => {
    dispatch(controlActions.setForceUpdate(true));
    dispatch(filterActions.clearFilter('shopsFilter'));

    reset();
    closeModal();
  };

  const filter = (
    values: IShopsFilterState,
    { setSubmitting }: FormikHelpers<IShopsFilterState>
  ) => {
    const { archive } = values;
    dispatch(controlActions.setShopsFilterState(values));
    dispatch(controlActions.setForceUpdate(true));
    dispatch(
      filterActions.activeFilter({
        filter: 'shopsFilter',
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
        <ModalHeader>Фильтры филиалов</ModalHeader>
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

export default ShopsFilterModal;
