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
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { modalActions } from 'store/reducers/ModalSlice';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import { controlActions } from 'store/reducers/ControlSlice';
import {
  EditableAvatar,
  MaskedInput,
  MoyskladCounterpartyModal,
} from 'components';
import { correctPhone, getFileImageSrc } from 'helpers';
import FileAPI from 'api/FileAPI/FileAPI';
import AuthAPI from 'api/AuthAPI/AuthAPI';
import {
  REQUIRED_INVALID_MSG,
  MIN_INVALID_MSG,
  MODES,
  ICON_SIZE,
  ICON_STROKE,
} from 'constants/app';
import UserAPI from 'api/UserAPI/UserAPI';
import { CreateUserDto } from 'api/UserAPI/dto/create-user.dto';
import { UpdateUserDto } from 'api/UserAPI/dto/update-user.dto';
import * as Yup from 'yup';
import VerificationAPI from 'api/VerificationAPI/VerificationAPI';
import { ICounterparty } from 'models/api/moysklad/ICounterparty';
import { getAccumulationDiscount } from 'helpers/moysklad';
import { IconReplace, IconUnlink } from '@tabler/icons-react';
import { IconMoysklad } from 'icons';
import { getErrorToast } from 'helpers/toast';
import styles from './UserEditModal.module.scss';

interface FormValues {
  name: string;
  surname: string;
  patronymic: string;
  password: string;
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
  password: '',
  phone: '',
  discount: '0',
  email: '',
  vk: '',
  telegram: '',
};

const editFormSchema = Yup.object({
  phone: Yup.string().required(REQUIRED_INVALID_MSG).min(11, MIN_INVALID_MSG),
});

const addFormSchema = editFormSchema.shape({
  password: Yup.string().required(REQUIRED_INVALID_MSG),
});

const UserEditModal = () => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [moyskladId, setMoyskladId] = useState<string | null>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormValues>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, userId, mode } = useAppSelector(
    (state) => state.modal.usersEditModal
  );
  const isImportedFromMoysklad = moyskladId !== null;

  const moyskladCounterpartyModal = useDisclosure();

  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (isOpen && mode === MODES.EDIT_MODE) {
      fetchUser();
    }
  }, [isOpen]);

  const fetchUser = () => {
    if (!userId) return;
    setIsLoading(true);
    UserAPI.getOne(userId)
      .then((data) => {
        setAvatar(data.avatar);
        setMoyskladId(data.moyskladId);
        setFormState({
          ...data,
          password: '',
          discount: data.discount.toString(),
        });

        VerificationAPI.isVerified(data.phone).then((data2) => {
          setIsPhoneVerified(data2.phoneVerified);
        });
      })
      .catch((e) => toast(getErrorToast('UserEditModal.fetchUser', e)))
      .finally(() => setIsLoading(false));
  };

  const createUser = (avatarLink: string | null, values: FormValues) => {
    const createdUser: CreateUserDto = {
      ...values,
      discount: Number(values.discount),
      avatar: avatarLink,
      moyskladId,
      moyskladSynchronizedAt: isImportedFromMoysklad
        ? new Date().toISOString()
        : null,
    };

    return new Promise((resolve, reject) => {
      AuthAPI.registrationUser(createdUser)
        .then((data) => {
          closeModal(true);
          resolve(data);
        })
        .catch((e) => reject(e));
    });
  };

  const updateUser = (avatarLink: string | null, values: FormValues) => {
    const updateduser: UpdateUserDto = {
      ...values,
      id: userId,
      password: undefined,
      discount: Number(values.discount),
      avatar: avatarLink,
      moyskladId,
      moyskladSynchronizedAt: isImportedFromMoysklad
        ? new Date().toISOString()
        : null,
    };

    return new Promise((resolve, reject) => {
      UserAPI.update(updateduser)
        .then((data) => {
          closeModal(true);
          resolve(data);
        })
        .catch((e) => reject(e));
    });
  };

  const submit = (values: FormValues) => {
    setIsLoading(true);
    if (mode === MODES.ADD_MODE) {
      if (avatarFile) {
        FileAPI.uploadAvatar(avatarFile)
          .then(({ link }) => {
            setIsLoading(true);
            createUser(link, values)
              .catch((e) => toast(getErrorToast('UserEditModal.createUser', e)))
              .finally(() => setIsLoading(false));
          })
          .catch((e) => toast(getErrorToast('UserEditModal.uploadAvatar', e)))
          .finally(() => setIsLoading(false));
      } else {
        createUser(null, values)
          .catch((e) => toast(getErrorToast('UserEditModal.createUser', e)))
          .finally(() => setIsLoading(false));
      }
    } else {
      if (avatarFile) {
        FileAPI.uploadAvatar(avatarFile)
          .then(({ link }) => {
            setIsLoading(true);
            updateUser(link, values)
              .catch((e) => toast(getErrorToast('UserEditModal.updateUser', e)))
              .finally(() => setIsLoading(false));
          })
          .catch((e) => toast(getErrorToast('UserEditModal.uploadAvatar', e)))
          .finally(() => setIsLoading(false));
      } else {
        updateUser(avatar, values)
          .catch((e) => toast(getErrorToast('UserEditModal.updateUser', e)))
          .finally(() => setIsLoading(false));
      }
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatar(null);
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
    if (!moyskladId) return;
    setIsLoading(true);
    UserAPI.syncOne(moyskladId)
      .then(() => {
        closeModal();
      })
      .catch((e) =>
        toast(getErrorToast('UserEditModal.syncOneFromMoysklad', e))
      )
      .finally(() => setIsLoading(false));
  };

  const unpinMoysklad = () => {
    setMoyskladId(null);
  };

  const closeModal = (forceUpdate: boolean = false) => {
    setAvatarFile(null);
    setAvatar(null);
    setMoyskladId(null);
    setIsPhoneVerified(false);
    setFormState(INITIAL_FORM_STATE);
    dispatch(modalActions.closeModal('usersEditModal'));
    if (forceUpdate) dispatch(controlActions.setForceUpdate(true));
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
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {mode === MODES.ADD_MODE ? 'Новый клиент' : 'Редактирование'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LoaderWrapper isLoading={isLoading}>
              <div className={styles.container}>
                <div className={styles.avatar_container}>
                  <EditableAvatar
                    avatar={avatarFile ? getFileImageSrc(avatarFile) : avatar}
                    onAvatarSelect={setAvatarFile}
                    onAvatarRemove={removeAvatar}
                  />
                  {isPhoneVerified && (
                    <>
                      <Text textAlign="center">{`Пользователь активировал аккаунт.\nНекоторые данные изменить нельзя.`}</Text>
                      <Button onClick={() => setIsPhoneVerified(false)}>
                        Разблокировать
                      </Button>
                    </>
                  )}
                </div>
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
                          Синхронизировать
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
                    validationSchema={
                      mode === MODES.ADD_MODE ? addFormSchema : editFormSchema
                    }
                    enableReinitialize
                    onSubmit={submit}
                  >
                    {() => (
                      <Form className={styles.form}>
                        <div className={styles.form_columns}>
                          <div className={styles.form_column}>
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
                            {mode === MODES.ADD_MODE && (
                              <Field name="password">
                                {({ field, meta }: FieldProps) => (
                                  <FormControl
                                    isInvalid={
                                      !!meta.error &&
                                      meta.touched &&
                                      !isPhoneVerified
                                    }
                                  >
                                    <FormLabel>Пароль</FormLabel>
                                    <Input
                                      {...field}
                                      placeholder="Пароль"
                                      isDisabled={isPhoneVerified}
                                      type="password"
                                    />
                                    <FormErrorMessage>
                                      {meta.error}
                                    </FormErrorMessage>
                                  </FormControl>
                                )}
                              </Field>
                            )}
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
                          </div>
                          <div>
                            <Divider orientation="vertical" mx={4} />
                          </div>
                          <div className={styles.form_column}>
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
                            onClick={() => closeModal()}
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
                </div>
              </div>
            </LoaderWrapper>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserEditModal;
