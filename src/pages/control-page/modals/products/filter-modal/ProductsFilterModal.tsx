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
import styles from './ProductsFilterModal.module.scss';

export interface IProductsFilterState {
  archive: boolean;
}

export const INITIAL_PRODUCTS_FILTER_STATE: IProductsFilterState = {
  archive: false,
};

const ProductsFilterModal = () => {
  const { isOpen } = useAppSelector((state) => state.modal.productsFilterModal);
  const filterState = useAppSelector(
    (state) => state.control.productsFilterState
  );

  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(modalActions.closeModal('productsFilterModal'));
  };

  const reset = () => {
    dispatch(
      controlActions.setProductsFilterState(INITIAL_PRODUCTS_FILTER_STATE)
    );
  };

  const clear = () => {
    dispatch(controlActions.setForceUpdate(true));
    dispatch(filterActions.clearFilter('productsFilter'));

    reset();
    closeModal();
  };

  const filter = (
    values: IProductsFilterState,
    { setSubmitting }: FormikHelpers<IProductsFilterState>
  ) => {
    const { archive } = values;
    dispatch(controlActions.setProductsFilterState(values));
    dispatch(controlActions.setForceUpdate(true));
    dispatch(
      filterActions.activeFilter({
        filter: 'productsFilter',
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
        <ModalHeader>Фильтры услуг</ModalHeader>
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

export default ProductsFilterModal;
