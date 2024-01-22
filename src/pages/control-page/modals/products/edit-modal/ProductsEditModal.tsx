import { useAppDispatch, useAppSelector } from 'hooks/redux';
import {
  Badge,
  Button,
  Divider,
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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Switch,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { modalActions } from 'store/reducers/ModalSlice';
import {
  ICON_SIZE,
  ICON_STROKE,
  REQUIRED_INVALID_MSG,
  MODES,
} from 'constants/app';
import { Field, FieldProps, Form, Formik } from 'formik';
import { IconMoysklad } from 'icons';
import { useEffect, useState } from 'react';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import MoyskladAssortmentsModal from '../moysklad-assortments-modal/MoyskladAssortmentsModal';
import { getSellingPrice } from 'helpers/moysklad';
import { IconReplace, IconUnlink } from '@tabler/icons-react';
import ProductAPI from 'api/ProductAPI/ProductAPI';
import { CreateProductDto } from 'api/ProductAPI/dto/create-product.dto';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import { controlActions } from 'store/reducers/ControlSlice';
import { UpdateProductDto } from 'api/ProductAPI/dto/update-product.dto';
import { AutoResizableTextarea, EditableImage } from 'components';
import { getFileImageSrc } from 'helpers';
import FileAPI from 'api/FileAPI/FileAPI';
import * as Yup from 'yup';
import styles from './ProductsEditModal.module.scss';

interface FormValues {
  name: string;
  price: string;
  discountProhibited: boolean;
}

const INITIAL_FORM_STATE: FormValues = {
  name: '',
  price: '0',
  discountProhibited: false,
};

const formSchema = Yup.object({
  name: Yup.string().required(REQUIRED_INVALID_MSG),
  price: Yup.string().required(REQUIRED_INVALID_MSG),
});

const ProductsEditModal = () => {
  const [moyskladId, setMoyskladId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormValues>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBulkImport, setIsBulkImport] = useState<boolean>(false);

  const { isOpen, productId, mode } = useAppSelector(
    (state) => state.modal.productsEditModal
  );
  const isImportedFromMoysklad = moyskladId !== null;

  const moyskladAssortmentsModal = useDisclosure();
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (isOpen && mode === MODES.EDIT_MODE) {
      fetchProduct();
    }
  }, [isOpen]);

  const fetchProduct = () => {
    if (!productId) return;
    setIsLoading(true);
    ProductAPI.getOne(productId)
      .then((data) => {
        setMoyskladId(data.moyskladId);
        setImage(data.image);
        setFormState({ ...data, price: data.price.toString() });
      })
      .catch((e) =>
        toast({
          title: 'ProductsEditModal.fetchProduct',
          description: e.response.data ? e.response.data.message : e.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      )
      .finally(() => setIsLoading(false));
  };

  const openMoyskladAssortmentsModal = (isBulk: boolean = false) => {
    setIsBulkImport(isBulk);
    moyskladAssortmentsModal.onOpen();
    if (isBulk) {
      closeModal();
    }
  };

  const importFromMoysklad = (assortment: IAssortment) => {
    const price = assortment.salePrices
      ? (getSellingPrice(assortment.salePrices).salePrice?.value || 0) * 0.01
      : 0;
    setFormState({
      name: assortment.name,
      price: price.toString(),
      discountProhibited: assortment.discountProhibited,
    });
    setMoyskladId(assortment.id);
  };

  const syncOneFromMoysklad = () => {
    if (!moyskladId) return;
    setIsLoading(true);
    ProductAPI.syncOne(moyskladId)
      .then(() => {
        closeModal(true);
      })
      .catch((e) =>
        toast({
          title: 'ProductsEditModal.syncOneFromMoysklad',
          description: e.response.data ? e.response.data.message : e.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      )
      .finally(() => setIsLoading(false));
  };

  const unpinMoysklad = () => {
    setMoyskladId(null);
  };

  const uploadImage = (image: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      FileAPI.uploadFile(image, { isManagerFile: true })
        .then((res) => {
          if (res.ok) {
            res.json().then((data) => resolve(data.link));
          } else {
            res.json().then((data) => reject(data.message));
          }
        })
        .catch((e) =>
          reject(e.response.data ? e.response.data.message : e.message)
        );
    });
  };

  const createProduct = (imageLink: string | null, values: FormValues) => {
    const createdProduct: CreateProductDto = {
      ...values,
      price: Number(values.price),
      image: imageLink,
      moyskladId,
      moyskladSynchronizedAt: isImportedFromMoysklad
        ? new Date().toISOString()
        : null,
    };

    return new Promise((resolve, reject) => {
      ProductAPI.create(createdProduct)
        .then((data) => {
          closeModal(true);
          resolve(data);
        })
        .catch((e) =>
          reject(e.response.data ? e.response.data.message : e.message)
        );
    });
  };

  const updateProduct = (imageLink: string | null, values: FormValues) => {
    const updatedProduct: UpdateProductDto = {
      ...values,
      id: productId,
      price: Number(values.price),
      image: imageLink,
      moyskladId,
      moyskladSynchronizedAt: isImportedFromMoysklad
        ? new Date().toISOString()
        : null,
    };

    return new Promise((resolve, reject) => {
      ProductAPI.update(updatedProduct)
        .then((data) => {
          closeModal(true);
          resolve(data);
        })
        .catch((e) =>
          reject(e.response.data ? e.response.data.message : e.message)
        );
    });
  };

  const submit = (values: FormValues) => {
    setIsLoading(true);
    if (mode === MODES.ADD_MODE) {
      if (imageFile) {
        uploadImage(imageFile)
          .then((imageLink) => {
            setIsLoading(true);
            createProduct(imageLink, values)
              .catch((error) =>
                toast({
                  title: 'ProductsEditModal.createProduct',
                  description: error,
                  status: 'error',
                  duration: 9000,
                  isClosable: true,
                })
              )
              .finally(() => setIsLoading(false));
          })
          .catch((error) =>
            toast({
              title: 'ProductsEditModal.uploadImage',
              description: error,
              status: 'error',
              duration: 9000,
              isClosable: true,
            })
          )
          .finally(() => setIsLoading(false));
      } else {
        createProduct(null, values)
          .catch((error) =>
            toast({
              title: 'ProductsEditModal.createProduct',
              description: error,
              status: 'error',
              duration: 9000,
              isClosable: true,
            })
          )
          .finally(() => setIsLoading(false));
      }
    } else {
      if (imageFile) {
        uploadImage(imageFile)
          .then((imageLink) => {
            setIsLoading(true);
            updateProduct(imageLink, values)
              .catch((error) =>
                toast({
                  title: 'ProductsEditModal.updateProduct',
                  description: error,
                  status: 'error',
                  duration: 9000,
                  isClosable: true,
                })
              )
              .finally(() => setIsLoading(false));
          })
          .catch((error) =>
            toast({
              title: 'ProductsEditModal.uploadImage',
              description: error,
              status: 'error',
              duration: 9000,
              isClosable: true,
            })
          )
          .finally(() => setIsLoading(false));
      } else {
        updateProduct(image, values)
          .catch((error) =>
            toast({
              title: 'ProductsEditModal.updateProduct',
              description: error,
              status: 'error',
              duration: 9000,
              isClosable: true,
            })
          )
          .finally(() => setIsLoading(false));
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImage(null);
  };

  const closeModal = (forceUpdate: boolean = false) => {
    setMoyskladId(null);
    setImageFile(null);
    setImage(null);
    setFormState(INITIAL_FORM_STATE);
    dispatch(modalActions.closeModal('productsEditModal'));
    if (forceUpdate) dispatch(controlActions.setForceUpdate(true));
  };

  return (
    <>
      <MoyskladAssortmentsModal
        isOpen={moyskladAssortmentsModal.isOpen}
        isBulkImport={isBulkImport}
        onClose={moyskladAssortmentsModal.onClose}
        onAssortmentClick={importFromMoysklad}
      />
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        blockScrollOnMount={false}
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {mode === MODES.ADD_MODE ? 'Новый продукт' : 'Редактирование'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LoaderWrapper isLoading={isLoading}>
              <div className={styles.container}>
                <EditableImage
                  image={imageFile ? getFileImageSrc(imageFile) : image}
                  onImageSelect={setImageFile}
                  onImageRemove={removeImage}
                />
                <div>
                  <Divider orientation="vertical" mx={2} />
                </div>
                <div className={styles.form_container}>
                  {isImportedFromMoysklad ? (
                    <>
                      <Badge colorScheme="blue" w="100%" textAlign="center">
                        Импортировано из МойСклад
                      </Badge>
                      <div className={styles.header}>
                        <Button
                          className={styles.header_button}
                          leftIcon={
                            <IconReplace
                              size={ICON_SIZE}
                              stroke={ICON_STROKE}
                            />
                          }
                          onClick={() => openMoyskladAssortmentsModal()}
                        >
                          Заменить
                        </Button>
                        <Button
                          className={styles.header_button}
                          leftIcon={
                            <IconUnlink size={ICON_SIZE} stroke={ICON_STROKE} />
                          }
                          onClick={unpinMoysklad}
                        >
                          Открепить
                        </Button>
                      </div>
                      {mode === MODES.EDIT_MODE && (
                        <Button
                          className={styles.header_button}
                          leftIcon={
                            <IconMoysklad
                              size={ICON_SIZE}
                              stroke={ICON_STROKE}
                            />
                          }
                          onClick={syncOneFromMoysklad}
                        >
                          Синхронизировать
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        className={styles.header_button}
                        leftIcon={
                          <IconMoysklad size={ICON_SIZE} stroke={ICON_STROKE} />
                        }
                        onClick={() => openMoyskladAssortmentsModal()}
                      >
                        Импортировать из МойСклад
                      </Button>
                      <Button
                        className={styles.header_button}
                        leftIcon={
                          <IconMoysklad size={ICON_SIZE} stroke={ICON_STROKE} />
                        }
                        marginTop="var(--space-sm)"
                        onClick={() => openMoyskladAssortmentsModal(true)}
                      >
                        Импортировать несколько из МойСклад
                      </Button>
                    </>
                  )}
                  <Divider my={4} />
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
                            <FormControl
                              isInvalid={!!meta.error && meta.touched}
                            >
                              <FormLabel>Наименование</FormLabel>
                              <AutoResizableTextarea
                                {...field}
                                placeholder="Наименование"
                              />
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="price">
                          {({ field, form, meta }: FieldProps) => (
                            <FormControl
                              isInvalid={!!meta.error && meta.touched}
                            >
                              <FormLabel>Цена</FormLabel>
                              <NumberInput
                                value={field.value}
                                defaultValue={field.value}
                                min={0}
                                onChange={(value) =>
                                  form.setFieldValue(field.name, value)
                                }
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="discountProhibited">
                          {({ field }: FieldProps) => (
                            <FormControl
                              flexDirection="row"
                              display="flex"
                              alignItems="center"
                            >
                              <FormLabel mb={0}>Запретить скидки</FormLabel>
                              <Switch {...field} isChecked={field.value} />
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
                </div>
              </div>
            </LoaderWrapper>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductsEditModal;
