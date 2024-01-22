import {
  Button,
  FormControl,
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
  Textarea,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { FC, useEffect, useState } from 'react';
import { useAppDispatch } from 'hooks/redux';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { endingGoodsActions } from 'store/reducers/EndingGoodsSlice';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import styles from './EndingGoodsEditProductModal.module.scss';

interface EndingGoodsEditProductModalProps {
  type: string;
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  article: string;
  code: string;
  minimumBalance: string;
  description: string;
}

const INITIAL_FORM_STATE: FormValues = {
  article: '',
  code: '',
  minimumBalance: '0',
  description: '',
};

const EndingGoodsEditProductModal: FC<EndingGoodsEditProductModalProps> = ({
  type,
  productId,
  isOpen,
  onClose,
}) => {
  const [startMinimumBalance, setStartMinimumBalance] = useState<string>('0');
  const [variantParentId, setVariantParentId] = useState<string>('');
  const [formState, setFormState] = useState<FormValues>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      fetchProduct();
    }
  }, [isOpen]);

  const fetchProduct = () => {
    setIsLoading(true);

    if (type === 'product') {
      MoyskladAPI.getProduct(productId)
        .then((productData) => {
          setFormState({
            article: productData.article || '',
            code: productData.code || '',
            minimumBalance: productData.minimumBalance?.toString() || '0',
            description: productData.description || '',
          });
        })
        .finally(() => setIsLoading(false));
    } else if (type === 'variant') {
      MoyskladAPI.getVariant(productId)
        .then((variantData) => {
          setFormState({
            article: '',
            code: variantData.code || '',
            minimumBalance:
              variantData.product.minimumBalance?.toString() || '0',
            description: variantData.description || '',
          });
          setStartMinimumBalance(
            variantData.product.minimumBalance?.toString() || '0'
          );
          setVariantParentId(variantData.product.id);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const updateProduct = (values: FormValues) => {
    setIsLoading(true);
    const { article, code, minimumBalance, description } = values;

    if (type === 'product') {
      MoyskladAPI.updateProduct({
        id: productId,
        article,
        code,
        description,
        minimumBalance: Number(minimumBalance),
      })
        .then(() => {
          dispatch(endingGoodsActions.setForceUpdateProduct(true));
          closeModal();
        })
        .finally(() => setIsLoading(false));
    } else if (type === 'variant') {
      MoyskladAPI.updateVariant({ id: productId, code, description }).then(
        () => {
          if (startMinimumBalance !== minimumBalance) {
            MoyskladAPI.updateProduct({
              id: variantParentId,
              minimumBalance: Number(minimumBalance),
            })
              .then(() => {
                dispatch(endingGoodsActions.setForceUpdateProduct(true));
                closeModal();
              })
              .finally(() => setIsLoading(false));
          } else {
            dispatch(endingGoodsActions.setForceUpdateProduct(true));
            closeModal();
          }
        }
      );
    }
  };

  const closeModal = () => {
    onClose();
    setFormState(INITIAL_FORM_STATE);
    setStartMinimumBalance('0');
    setVariantParentId('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Редактирование
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <LoaderWrapper isLoading={isLoading}>
            <Formik
              initialValues={formState}
              enableReinitialize
              onSubmit={updateProduct}
            >
              {(props) => (
                <Form className={styles.form}>
                  {type === 'product' && (
                    <Field name="article">
                      {({ field }: FieldProps) => (
                        <FormControl>
                          <FormLabel>Артикул</FormLabel>
                          <Input {...field} placeholder="Артикул" />
                        </FormControl>
                      )}
                    </Field>
                  )}
                  <Field name="code">
                    {({ field }: FieldProps) => (
                      <FormControl>
                        <FormLabel>Код</FormLabel>
                        <Input {...field} placeholder="Код" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="minimumBalance">
                    {({ field, form }: FieldProps) => (
                      <FormControl>
                        <FormLabel>Неснижаемый остаток</FormLabel>
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
                      </FormControl>
                    )}
                  </Field>
                  <Field name="description">
                    {({ field }: FieldProps) => (
                      <FormControl>
                        <FormLabel>Комментарий</FormLabel>
                        <Textarea {...field} placeholder="Комментарий" />
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    className={styles.submit_button}
                    isLoading={props.isSubmitting}
                    type="submit"
                    colorScheme="yellow"
                  >
                    Сохранить
                  </Button>
                </Form>
              )}
            </Formik>
          </LoaderWrapper>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EndingGoodsEditProductModal;
