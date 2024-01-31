import { useAppDispatch, useAppSelector } from 'hooks/redux';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { modalActions } from 'store/reducers/ModalSlice';
import { REQUIRED_INVALID_MSG, MODES } from 'constants/app';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import { controlActions } from 'store/reducers/ControlSlice';
import * as Yup from 'yup';
import ShopAPI from 'api/ShopAPI/ShopAPI';
import { CreateShopDto } from 'api/ShopAPI/dto/create-shop.dto';
import { UpdateShopDto } from 'api/ShopAPI/dto/update-shop.dto';
import { getErrorToast } from 'helpers/toast';
import styles from './ShopsEditModal.module.scss';

interface FormValues {
  name: string;
  abbreviation: string;
  description: string;
  address: string;
}

const INITIAL_FORM_STATE: FormValues = {
  name: '',
  abbreviation: '',
  description: '',
  address: '',
};

const formSchema = Yup.object({
  name: Yup.string().required(REQUIRED_INVALID_MSG),
  abbreviation: Yup.string().required(REQUIRED_INVALID_MSG),
  description: Yup.string().required(REQUIRED_INVALID_MSG),
  address: Yup.string().required(REQUIRED_INVALID_MSG),
});

const ShopsEditModal = () => {
  const [formState, setFormState] = useState<FormValues>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, shopId, mode } = useAppSelector(
    (state) => state.modal.shopsEditModal
  );

  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (isOpen && mode === MODES.EDIT_MODE) {
      fetchShop();
    }
  }, [isOpen]);

  const fetchShop = () => {
    if (!shopId) return;
    setIsLoading(true);
    ShopAPI.getOne(shopId)
      .then((data) => {
        setFormState(data);
      })
      .catch((e) => toast(getErrorToast('ShopsEditModal.fetchShop', e)))
      .finally(() => setIsLoading(false));
  };

  const createShop = (values: FormValues) => {
    const createdShop: CreateShopDto = values;

    ShopAPI.create(createdShop)
      .then(() => {
        closeModal(true);
      })
      .catch((e) => toast(getErrorToast('ShopsEditModal.createShop', e)))
      .finally(() => setIsLoading(false));
  };

  const updateShop = (values: FormValues) => {
    const updatedShop: UpdateShopDto = {
      ...values,
      id: shopId,
    };

    ShopAPI.update(updatedShop)
      .then(() => {
        closeModal(true);
      })
      .catch((e) => toast(getErrorToast('ShopsEditModal.updateShop', e)))
      .finally(() => setIsLoading(false));
  };

  const submit = (values: FormValues) => {
    setIsLoading(true);
    if (mode === MODES.ADD_MODE) {
      createShop(values);
    } else {
      updateShop(values);
    }
  };

  const closeModal = (forceUpdate: boolean = false) => {
    setFormState(INITIAL_FORM_STATE);
    dispatch(modalActions.closeModal('shopsEditModal'));
    if (forceUpdate) dispatch(controlActions.setForceUpdate(true));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === MODES.ADD_MODE ? 'Новый филиал' : 'Редактирование'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <LoaderWrapper isLoading={isLoading}>
            <Formik
              initialValues={formState}
              validationSchema={formSchema}
              enableReinitialize
              onSubmit={submit}
            >
              {() => (
                <Form className={styles.form}>
                  <Field name="name">
                    {({ field, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && meta.touched}>
                        <FormLabel>Наименование</FormLabel>
                        <Input {...field} placeholder="Наименование" />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="abbreviation">
                    {({ field, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && meta.touched}>
                        <FormLabel>Аббревиатура</FormLabel>
                        <Input {...field} placeholder="Аббревиатура" />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="description">
                    {({ field, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && meta.touched}>
                        <FormLabel>Описание</FormLabel>
                        <Textarea {...field} placeholder="Описание" />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="address">
                    {({ field, meta }: FieldProps) => (
                      <FormControl isInvalid={!!meta.error && meta.touched}>
                        <FormLabel>Адрес</FormLabel>
                        <Input {...field} placeholder="Адрес" />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <div className={styles.footer}>
                    <Button
                      className={styles.footer_button}
                      onClick={() => closeModal()}
                    >
                      Отмена
                    </Button>
                    <Button
                      className={styles.footer_button}
                      type="submit"
                      colorScheme="yellow"
                    >
                      {mode === MODES.ADD_MODE ? 'Создать' : 'Сохранить'}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </LoaderWrapper>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShopsEditModal;
