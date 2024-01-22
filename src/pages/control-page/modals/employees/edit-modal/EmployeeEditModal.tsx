import { useAppDispatch, useAppSelector } from 'hooks/redux';
import {
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
  useToast,
} from '@chakra-ui/react';
import { modalActions } from 'store/reducers/ModalSlice';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { LoaderWrapper } from 'components/ui/loader/Loader';
import { controlActions } from 'store/reducers/ControlSlice';
import { EditableAvatar } from 'components';
import { getFileImageSrc } from 'helpers';
import FileAPI from 'api/FileAPI/FileAPI';
import EmployeeAPI from 'api/EmployeeAPI/EmployeeAPI';
import { CreateEmployeeDto } from 'api/EmployeeAPI/dto/create-employee.dto';
import AuthAPI from 'api/AuthAPI/AuthAPI';
import { UpdateEmployeeDto } from 'api/EmployeeAPI/dto/update-employee.dto';
import { REQUIRED_INVALID_MSG, MODES } from 'constants/app';
import { SelectField } from 'components/ui/select/Select';
import { IApp } from 'models/api/IApp';
import { IDepartment } from 'models/api/IDepartment';
import { employeeActions } from 'store/reducers/EmployeeSlice';
import { getRecentLogins, setRecentLogins } from 'helpers/localStorage';
import * as Yup from 'yup';
import styles from './EmployeeEditModal.module.scss';

interface FormValues {
  name: string;
  surname: string;
  login: string;
  password: string;
  roleId: number;
  apps: IApp[];
  departments: IDepartment[];
}

const INITIAL_FORM_STATE: FormValues = {
  name: '',
  surname: '',
  login: '',
  password: '',
  roleId: 0,
  apps: [],
  departments: [],
};

const editFormSchema = Yup.object({
  name: Yup.string().required(REQUIRED_INVALID_MSG),
  surname: Yup.string().required(REQUIRED_INVALID_MSG),
  login: Yup.string().required(REQUIRED_INVALID_MSG),
  roleId: Yup.number()
    .min(1, REQUIRED_INVALID_MSG)
    .required(REQUIRED_INVALID_MSG),
});

const addFormSchema = editFormSchema.shape({
  password: Yup.string().required(REQUIRED_INVALID_MSG),
});

const EmployeeEditModal = () => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormValues>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, employeeId, mode } = useAppSelector(
    (state) => state.modal.employeesEditModal
  );
  const employee = useAppSelector((state) => state.employee.employee);
  const roles = useAppSelector((state) => state.app.roles);
  const apps = useAppSelector((state) => state.app.apps);
  const departments = useAppSelector((state) => state.app.departments);

  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (isOpen && mode === MODES.EDIT_MODE) {
      fetchEmployee();
    }
  }, [isOpen]);

  const fetchEmployee = () => {
    if (!employeeId) return;
    setIsLoading(true);
    EmployeeAPI.getOne(employeeId)
      .then((data) => {
        setAvatar(data.avatar);
        setFormState({
          name: data.name,
          surname: data.surname,
          login: data.login,
          password: '',
          roleId: data.role?.id || 0,
          apps: data.apps || [],
          departments: data.departments || [],
        });
      })
      .catch((e) =>
        toast({
          title: 'EmployeeEditModal.fetchEmployee',
          description: e.response.data ? e.response.data.message : e.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      )
      .finally(() => setIsLoading(false));
  };

  const uploadAvatar = (image: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      FileAPI.uploadFile(image)
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

  const createEmployee = (avatarLink: string | null, values: FormValues) => {
    const createdEmployee: CreateEmployeeDto = {
      name: values.name,
      surname: values.surname,
      login: values.login,
      password: values.password,
      avatar: avatarLink,
      roleId: values.roleId,
    };

    const appIds: number[] = [];
    const departmentIds: number[] = [];
    values.apps.forEach((app) => appIds.push(app.id));
    values.departments.forEach((department) =>
      departmentIds.push(department.id)
    );

    return new Promise((resolve, reject) => {
      AuthAPI.registration(createdEmployee)
        .then((data) => {
          if (appIds.length) {
            EmployeeAPI.addApp({ appIds, employeeId: data.id });
          }
          if (departmentIds.length) {
            EmployeeAPI.addDepartment({ departmentIds, employeeId: data.id });
          }
          closeModal(true);
          resolve(data);
        })
        .catch((e) =>
          reject(e.response.data ? e.response.data.message : e.message)
        );
    });
  };

  const updateEmployee = (avatarLink: string | null, values: FormValues) => {
    const updatedEmployee: UpdateEmployeeDto = {
      id: employeeId,
      name: values.name,
      surname: values.surname,
      login: values.login,
      avatar: avatarLink,
      roleId: values.roleId,
    };

    const appIds: number[] = [];
    const departmentIds: number[] = [];
    values.apps.forEach((app) => appIds.push(app.id));
    values.departments.forEach((department) =>
      departmentIds.push(department.id)
    );

    return new Promise((resolve, reject) => {
      EmployeeAPI.update(updatedEmployee)
        .then(async (data) => {
          if (appIds.length) {
            await EmployeeAPI.addApp({ appIds, employeeId: data.id });
          }
          if (departmentIds.length) {
            await EmployeeAPI.addDepartment({
              departmentIds,
              employeeId: data.id,
            });
          }
          if (data.id === employee?.id) {
            const updatedEmployee = await EmployeeAPI.getOne(data.id);
            dispatch(employeeActions.updateEmployee(updatedEmployee));
            const recentLogins = getRecentLogins();
            const updatedRecentLogins = recentLogins.map((recentLogin) =>
              recentLogin.id === updatedEmployee.id
                ? { ...updatedEmployee, password: recentLogin.password }
                : recentLogin
            );
            setRecentLogins(updatedRecentLogins);
          }
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
      if (avatarFile) {
        uploadAvatar(avatarFile)
          .then((avatarLink) => {
            setIsLoading(true);
            createEmployee(avatarLink, values)
              .catch((error) =>
                toast({
                  title: 'EmployeeEditModal.createEmployee',
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
              title: 'EmployeeEditModal.uploadAvatar',
              description: error,
              status: 'error',
              duration: 9000,
              isClosable: true,
            })
          )
          .finally(() => setIsLoading(false));
      } else {
        createEmployee(null, values)
          .catch((error) =>
            toast({
              title: 'EmployeeEditModal.uploadAvatar',
              description: error,
              status: 'error',
              duration: 9000,
              isClosable: true,
            })
          )
          .finally(() => setIsLoading(false));
      }
    } else {
      if (avatarFile) {
        uploadAvatar(avatarFile)
          .then((avatarLink) => {
            setIsLoading(true);
            updateEmployee(avatarLink, values)
              .catch((error) =>
                toast({
                  title: 'EmployeeEditModal.updateEmployee',
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
              title: 'EmployeeEditModal.uploadAvatar',
              description: error,
              status: 'error',
              duration: 9000,
              isClosable: true,
            })
          )
          .finally(() => setIsLoading(false));
      } else {
        updateEmployee(avatar, values)
          .catch((error) =>
            toast({
              title: 'EmployeeEditModal.updateEmployee',
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

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatar(null);
  };

  const closeModal = (forceUpdate: boolean = false) => {
    setAvatarFile(null);
    setAvatar(null);
    setFormState(INITIAL_FORM_STATE);
    dispatch(modalActions.closeModal('employeesEditModal'));
    if (forceUpdate) dispatch(controlActions.setForceUpdate(true));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {mode === MODES.ADD_MODE ? 'Новый сотрудник' : 'Редактирование'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LoaderWrapper isLoading={isLoading}>
              <div className={styles.container}>
                <EditableAvatar
                  avatar={avatarFile ? getFileImageSrc(avatarFile) : avatar}
                  onAvatarSelect={setAvatarFile}
                  onAvatarRemove={removeAvatar}
                />
                <div>
                  <Divider orientation="vertical" mx={2} />
                </div>
                <div className={styles.form_container}>
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
                          <div
                            className={styles.form_column}
                            style={{ maxWidth: '150px' }}
                          >
                            <Field name="name">
                              {({ field, meta }: FieldProps) => (
                                <FormControl
                                  isInvalid={!!meta.error && meta.touched}
                                >
                                  <FormLabel>Имя</FormLabel>
                                  <Input {...field} placeholder="Имя" />
                                  <FormErrorMessage>
                                    {meta.error}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                            <Field name="surname">
                              {({ field, meta }: FieldProps) => (
                                <FormControl
                                  isInvalid={!!meta.error && meta.touched}
                                >
                                  <FormLabel>Фамилия</FormLabel>
                                  <Input {...field} placeholder="Фамилия" />
                                  <FormErrorMessage>
                                    {meta.error}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                            <Field name="login">
                              {({ field, meta }: FieldProps) => (
                                <FormControl
                                  isInvalid={!!meta.error && meta.touched}
                                >
                                  <FormLabel>Логин</FormLabel>
                                  <Input {...field} placeholder="Логин" />
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
                                    isInvalid={!!meta.error && meta.touched}
                                  >
                                    <FormLabel>Пароль</FormLabel>
                                    <Input
                                      {...field}
                                      placeholder="Пароль"
                                      type="password"
                                    />
                                    <FormErrorMessage>
                                      {meta.error}
                                    </FormErrorMessage>
                                  </FormControl>
                                )}
                              </Field>
                            )}
                          </div>
                          <div>
                            <Divider orientation="vertical" mx={4} />
                          </div>
                          <div className={styles.form_column}>
                            <Field name="roleId">
                              {({ field, form, meta }: FieldProps) => (
                                <FormControl
                                  isInvalid={!!meta.error && meta.touched}
                                >
                                  <FormLabel>Роль</FormLabel>
                                  <SelectField
                                    placeholder="Роль"
                                    options={roles}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                    fieldProps={field}
                                    formProps={form}
                                  />
                                  <FormErrorMessage>
                                    {meta.error}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                            <Field name="apps">
                              {({ field, form }: FieldProps) => (
                                <FormControl>
                                  <FormLabel>Доступные приложения</FormLabel>
                                  <SelectField
                                    placeholder="Приложения"
                                    options={apps}
                                    isMulti
                                    isClearable={false}
                                    getOptionLabel={(option) =>
                                      option.description
                                    }
                                    getOptionValue={(option) => option.id}
                                    fieldProps={field}
                                    formProps={form}
                                  />
                                </FormControl>
                              )}
                            </Field>
                            <Field name="departments">
                              {({ field, form }: FieldProps) => (
                                <FormControl>
                                  <FormLabel>Отделы</FormLabel>
                                  <SelectField
                                    placeholder="Отделы"
                                    options={departments}
                                    isMulti
                                    isClearable={false}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                    fieldProps={field}
                                    formProps={form}
                                  />
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

export default EmployeeEditModal;
