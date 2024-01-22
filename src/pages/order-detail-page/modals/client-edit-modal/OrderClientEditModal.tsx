import AuthAPI from 'api/AuthAPI/AuthAPI';
import { CreateUserDto } from 'api/UserAPI/dto/create-user.dto';
import UserAPI from 'api/UserAPI/UserAPI';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IUser } from 'models/api/IUser';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { correctPhone, firstLetterToUpperCase } from 'helpers';
import { orderActions } from 'store/reducers/OrderSlice';
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
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
  Divider,
  Text,
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { modalActions } from 'store/reducers/ModalSlice';
import { Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  ICON_SIZE,
  ICON_STROKE,
  MIN_INVALID_MSG,
  MODES,
  REQUIRED_INVALID_MSG,
} from 'constants/app';
import { MaskedInput, MoyskladCounterpartyModal } from 'components';
import OrderClientCard from 'pages/order-detail-page/components/client-card/OrderClientCard';
import { IconReplace, IconUnlink } from '@tabler/icons-react';
import { IconMoysklad } from 'icons';
import { ICounterparty } from 'models/api/moysklad/ICounterparty';
import { getAccumulationDiscount } from 'helpers/moysklad';
import VerificationAPI from 'api/VerificationAPI/VerificationAPI';
import { UpdateUserDto } from 'api/UserAPI/dto/update-user.dto';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import styles from './OrderClientEditModal.module.scss';

interface FormValues {
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  discount: string;
  email: string;
  vk: string;
  telegram: string;
}

const INITIAL_FORM_STATE: FormValues = {
  name: '',
  surname: '',
  patronymic: '',
  phone: '',
  discount: '0',
  email: '',
  vk: '',
  telegram: '',
};

const formSchema = Yup.object({
  phone: Yup.string().required(REQUIRED_INVALID_MSG).min(11, MIN_INVALID_MSG),
});

const OrderClientEditModal = () => {
  const [moyskladId, setMoyskladId] = useState<string | null>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [formState, setFormState] = useState<FormValues>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, searchText, phone, mode } = useAppSelector(
    (state) => state.modal.orderClientEditModal
  );
  const isImportedFromMoysklad = moyskladId !== null;

  const moyskladCounterpartyModal = useDisclosure();

  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (isOpen && mode === MODES.ADD_MODE) {
      if (searchText && searchText !== '') {
        let numbers = searchText
          .split(/([0-9]+)/)
          .filter((token) => token.match(/[0-9]/))
          .join('');

        if (!numbers) {
          numbers = '';
        } else {
          numbers = correctPhone(numbers);
        }

        const words = searchText
          .split(/([а-яА-Я]+)/)
          .filter((token) => token.match(/[а-яА-Я]/))
          .join('');

        setFormState({ ...INITIAL_FORM_STATE, name: words, phone: numbers });
      }
    } else if (isOpen && mode === MODES.EDIT_MODE) {
      isVerified();
    }
  }, [isOpen]);

  const isVerified = () => {
    if (!phone) return;
    setIsLoading(true);
    VerificationAPI.isVerified(phone)
      .then((data) => {
        setMoyskladId(data.user.moyskladId);
        setIsPhoneVerified(data.phoneVerified);
        setUser(data.user);
        setFormState({
          ...data.user,
          discount: data.user.discount.toString(),
        });
      })
      .finally(() => setIsLoading(false));
  };

  const createUser = (values: FormValues) => {
    const { name, surname, patronymic, phone, discount, email, vk, telegram } =
      values;
    setIsLoading(true);
    UserAPI.getOneByPhone(phone).then((data) => {
      if (data) {
        setUser(data);
        setIsLoading(false);
      } else {
        setUser(null);
        const createdUser: CreateUserDto = {
          name: firstLetterToUpperCase(name),
          surname,
          patronymic,
          phone,
          discount: Number(discount),
          email: email.toLowerCase(),
          vk: vk.toLowerCase(),
          telegram: telegram.toLowerCase(),
          password: uuidv4(),
          moyskladId,
          moyskladSynchronizedAt: isImportedFromMoysklad
            ? new Date().toISOString()
            : null,
        };

        AuthAPI.registrationUser(createdUser)
          .then((data2) => {
            dispatch(orderActions.setOrderUser(data2));
            dispatch(orderActions.setDiscount(Number(values.discount)));
            closeModal();
          })
          .catch((e) =>
            toast({
              title: 'OrderClientEditModal.createUser',
              description: e.response.data
                ? e.response.data.message
                : e.message,
              status: 'error',
              duration: 9000,
              isClosable: true,
            })
          )
          .finally(() => setIsLoading(false));
      }
    });
  };

  const updateUser = (values: FormValues) => {
    if (!user) return;
    setIsLoading(true);
    const updateduser: UpdateUserDto = {
      ...values,
      id: user.id,
      password: undefined,
      discount: Number(values.discount),
      moyskladId,
      moyskladSynchronizedAt: isImportedFromMoysklad
        ? new Date().toISOString()
        : null,
    };

    UserAPI.update(updateduser)
      .then((data) => {
        dispatch(orderActions.setOrderUser(data));
        dispatch(orderActions.setDiscount(Number(values.discount)));
        closeModal();
      })
      .catch((e) =>
        toast({
          title: 'OrderClientEditModal.updateUser',
          description: e.response.data ? e.response.data.message : e.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      )
      .finally(() => setIsLoading(false));
  };

  const submit = (values: FormValues) => {
    if (mode === MODES.ADD_MODE) {
      createUser(values);
    } else {
      updateUser(values);
    }
  };

  const selectUser = () => {
    if (user) {
      dispatch(orderActions.setOrderUser(user));
      closeModal();
    }
  };

  const openMoyskladCounterpartyModal = () => {
    moyskladCounterpartyModal.onOpen();
  };

  const importFromMoysklad = (counterparty: ICounterparty) => {
    const counterpartyName = counterparty.name.split(' ');
    const name = counterpartyName[1] || '';
    const surname = counterpartyName[0] || '';
    const patronymic = counterpartyName[2] || '';
    setFormState({
      ...INITIAL_FORM_STATE,
      name,
      surname,
      patronymic,
      phone: correctPhone(counterparty.phone),
      discount: getAccumulationDiscount(counterparty.discounts).toString(),
    });
    setMoyskladId(counterparty.id);
  };

  const syncOneFromMoysklad = () => {
    if (!moyskladId || !user) return;
    setIsLoading(true);
    UserAPI.syncOne(moyskladId)
      .then((data) => {
        dispatch(
          orderActions.setOrderUser({ ...user, discount: data.discount })
        );
        dispatch(orderActions.setDiscount(data.discount));
        closeModal();
      })
      .catch((e) =>
        toast({
          title: 'OrderClientEditModal.syncOneFromMoysklad',
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

  const closeModal = () => {
    dispatch(modalActions.closeModal('orderClientEditModal'));
    setMoyskladId(null);
    setIsPhoneVerified(false);
    setUser(null);
    setFormState(INITIAL_FORM_STATE);
  };

  return (
    <>
      <MoyskladCounterpartyModal
        isOpen={moyskladCounterpartyModal.isOpen}
        onClose={moyskladCounterpartyModal.onClose}
        onCounterpartyClick={importFromMoysklad}
      />
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        blockScrollOnMount={false}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {mode === MODES.ADD_MODE
              ? 'Регистрация клиента'
              : 'Редактирование клиента'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LoaderWrapper isLoading={isLoading}>
              {user && mode === MODES.ADD_MODE ? (
                <>
                  <Text className={styles.message}>
                    Данный номер телефона уже зарегистрирован.
                  </Text>
                  <OrderClientCard user={user} />
                  <div className={styles.footer}>
                    <Button
                      className={styles.footer_button}
                      onClick={() => setUser(null)}
                    >
                      Назад
                    </Button>
                    <Button
                      className={styles.footer_button}
                      colorScheme="yellow"
                      onClick={selectUser}
                    >
                      Выбрать
                    </Button>
                  </div>
                </>
              ) : (
                <>
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
                          onClick={openMoyskladCounterpartyModal}
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
                          Синхронизировать процент скидки
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      className={styles.header_button}
                      leftIcon={
                        <IconMoysklad size={ICON_SIZE} stroke={ICON_STROKE} />
                      }
                      onClick={openMoyskladCounterpartyModal}
                    >
                      Импортировать из МойСклад
                    </Button>
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
                        {isPhoneVerified && (
                          <Text className={styles.message}>
                            {`Пользователь активировал аккаунт.\nНекоторые данные изменить нельзя.`}
                          </Text>
                        )}
                        <div className={styles.form_columns}>
                          <div className={styles.form_column}>
                            <Field name="phone">
                              {({ field, form, meta }: FieldProps) => (
                                <FormControl
                                  isInvalid={
                                    !!meta.error &&
                                    meta.touched &&
                                    !isPhoneVerified
                                  }
                                >
                                  <FormLabel>Номер телефона</FormLabel>
                                  <MaskedInput
                                    {...field}
                                    placeholder="Номер телефона"
                                    isDisabled={isPhoneVerified}
                                    onChange={(value) =>
                                      form.setFieldValue(
                                        field.name,
                                        correctPhone(value)
                                      )
                                    }
                                  />
                                  <FormErrorMessage>
                                    {meta.error}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                            <Field name="name">
                              {({ field, meta }: FieldProps) => (
                                <FormControl
                                  isInvalid={
                                    !!meta.error &&
                                    meta.touched &&
                                    !isPhoneVerified
                                  }
                                >
                                  <FormLabel>Имя</FormLabel>
                                  <Input
                                    {...field}
                                    placeholder="Имя"
                                    isDisabled={isPhoneVerified}
                                  />
                                  <FormErrorMessage>
                                    {meta.error}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                            <Field name="surname">
                              {({ field }: FieldProps) => (
                                <FormControl>
                                  <FormLabel>Фамилия</FormLabel>
                                  <Input {...field} placeholder="Фамилия" />
                                </FormControl>
                              )}
                            </Field>
                            <Field name="patronymic">
                              {({ field }: FieldProps) => (
                                <FormControl>
                                  <FormLabel>Отчество</FormLabel>
                                  <Input {...field} placeholder="Отчество" />
                                </FormControl>
                              )}
                            </Field>
                          </div>
                          <div>
                            <Divider orientation="vertical" mx={4} />
                          </div>
                          <div className={styles.form_column}>
                            <Field name="discount">
                              {({ field, form }: FieldProps) => (
                                <FormControl>
                                  <FormLabel>Процент скидки</FormLabel>
                                  <NumberInput
                                    value={field.value}
                                    defaultValue={field.value}
                                    min={0}
                                    max={100}
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
                            <Field name="email">
                              {({ field }: FieldProps) => (
                                <FormControl>
                                  <FormLabel>Email</FormLabel>
                                  <Input
                                    {...field}
                                    placeholder="Email"
                                    type="email"
                                  />
                                </FormControl>
                              )}
                            </Field>
                            <Field name="vk">
                              {({ field }: FieldProps) => (
                                <FormControl>
                                  <FormLabel>ВКонтакте</FormLabel>
                                  <Input {...field} placeholder="ВКонтакте" />
                                </FormControl>
                              )}
                            </Field>
                            <Field name="telegram">
                              {({ field }: FieldProps) => (
                                <FormControl>
                                  <FormLabel>Telegram</FormLabel>
                                  <Input {...field} placeholder="Telegram" />
                                </FormControl>
                              )}
                            </Field>
                          </div>
                        </div>
                        <div className={styles.footer}>
                          <Button
                            className={styles.footer_button}
                            onClick={closeModal}
                          >
                            Отмена
                          </Button>
                          <Button
                            className={styles.footer_button}
                            type="submit"
                            colorScheme="yellow"
                          >
                            {mode === MODES.ADD_MODE
                              ? 'Зарегистрировать'
                              : 'Сохранить'}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </>
              )}
            </LoaderWrapper>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OrderClientEditModal;
