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
import { SelectFormField } from 'components/ui/select/Select';
import { IApp } from 'models/api/IApp';
import { IDepartment } from 'models/api/IDepartment';
import { employeeActions } from 'store/reducers/EmployeeSlice';
import { getRecentLogins, setRecentLogins } from 'helpers/localStorage';
import { getErrorToast } from 'helpers/toast';
import { IRole } from 'models/api/IRole';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PasswordInputFormField } from 'components/ui/password-input/PasswordInput';
import styles from './EmployeeEditModal.module.scss';

interface FormValues {
  name: string;
  surname: string;
  login: string;
  password: string;
  roles: IRole[];
  apps: IApp[];
  departments: IDepartment[];
}

const INITIAL_FORM_STATE: FormValues = {
  name: '',
  surname: '',
  login: '',
  password: '',
  roles: [],
  apps: [],
  departments: [],
};

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({ values: formState });

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
          roles: data.roles || [],
          apps: data.apps || [],
          departments: data.departments || [],
        });
      })
      .catch((e) => toast(getErrorToast('EmployeeEditModal.fetchEmployee', e)))
      .finally(() => setIsLoading(false));
  };

  const createEmployee = (avatarLink: string | null, values: FormValues) => {
    const createdEmployee: CreateEmployeeDto = {
      name: values.name,
      surname: values.surname,
      login: values.login,
      password: values.password,
      avatar: avatarLink,
    };

    const roleIds: number[] = [];
    const appIds: number[] = [];
    const departmentIds: number[] = [];
    values.roles.forEach((role) => roleIds.push(role.id));
    values.apps.forEach((app) => appIds.push(app.id));
    values.departments.forEach((department) =>
      departmentIds.push(department.id)
    );

    return new Promise((resolve, reject) => {
      AuthAPI.registration(createdEmployee)
        .then((data) => {
          if (roleIds.length) {
            EmployeeAPI.addRole({ roleIds, employeeId: data.id });
          }
          if (appIds.length) {
            EmployeeAPI.addApp({ appIds, employeeId: data.id });
          }
          if (departmentIds.length) {
            EmployeeAPI.addDepartment({ departmentIds, employeeId: data.id });
          }
          closeModal(true);
          resolve(data);
        })
        .catch((e) => reject(e));
    });
  };

  const updateEmployee = (avatarLink: string | null, values: FormValues) => {
    const updatedEmployee: UpdateEmployeeDto = {
      id: employeeId,
      name: values.name,
      surname: values.surname,
      login: values.login,
      avatar: avatarLink,
    };

    const roleIds: number[] = [];
    const appIds: number[] = [];
    const departmentIds: number[] = [];
    values.roles.forEach((role) => roleIds.push(role.id));
    values.apps.forEach((app) => appIds.push(app.id));
    values.departments.forEach((department) =>
      departmentIds.push(department.id)
    );

    return new Promise((resolve, reject) => {
      EmployeeAPI.update(updatedEmployee)
        .then(async (data) => {
          if (roleIds.length) {
            await EmployeeAPI.addRole({ roleIds, employeeId: data.id });
          }
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
        .catch((e) => reject(e));
    });
  };

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    setIsLoading(true);
    if (mode === MODES.ADD_MODE) {
      if (avatarFile) {
        FileAPI.uploadAvatar(avatarFile)
          .then(({ link }) => {
            setIsLoading(true);
            createEmployee(link, values)
              .catch((e) =>
                toast(getErrorToast('EmployeeEditModal.createEmployee', e))
              )
              .finally(() => setIsLoading(false));
          })
          .catch((e) =>
            toast(getErrorToast('EmployeeEditModal.uploadAvatar', e))
          )
          .finally(() => setIsLoading(false));
      } else {
        createEmployee(null, values)
          .catch((e) =>
            toast(getErrorToast('EmployeeEditModal.uploadAvatar', e))
          )
          .finally(() => setIsLoading(false));
      }
    } else {
      if (avatarFile) {
        FileAPI.uploadAvatar(avatarFile)
          .then(({ link }) => {
            setIsLoading(true);
            updateEmployee(link, values)
              .catch((e) =>
                toast(getErrorToast('EmployeeEditModal.updateEmployee', e))
              )
              .finally(() => setIsLoading(false));
          })
          .catch((e) =>
            toast(getErrorToast('EmployeeEditModal.uploadAvatar', e))
          )
          .finally(() => setIsLoading(false));
      } else {
        updateEmployee(avatar, values)
          .catch((e) =>
            toast(getErrorToast('EmployeeEditModal.updateEmployee', e))
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
    reset();
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
                  <form
                    className={styles.form}
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className={styles.form_columns}>
                      <div
                        className={styles.form_column}
                        style={{ maxWidth: '150px' }}
                      >
                        <FormControl isRequired isInvalid={!!errors.name}>
                          <FormLabel>Имя</FormLabel>
                          <Input
                            {...register('name', {
                              required: REQUIRED_INVALID_MSG,
                            })}
                            placeholder="Имя"
                          />
                          <FormErrorMessage>
                            {errors.name?.message}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl isRequired isInvalid={!!errors.surname}>
                          <FormLabel>Фамилия</FormLabel>
                          <Input
                            {...register('surname', {
                              required: REQUIRED_INVALID_MSG,
                            })}
                            placeholder="Фамилия"
                          />
                          <FormErrorMessage>
                            {errors.surname?.message}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl isRequired isInvalid={!!errors.login}>
                          <FormLabel>Логин</FormLabel>
                          <Input
                            {...register('login', {
                              required: REQUIRED_INVALID_MSG,
                            })}
                            placeholder="Логин"
                          />
                          <FormErrorMessage>
                            {errors.login?.message}
                          </FormErrorMessage>
                        </FormControl>
                        {mode === MODES.ADD_MODE && (
                          <FormControl isRequired isInvalid={!!errors.password}>
                            <FormLabel>Пароль</FormLabel>
                            <PasswordInputFormField
                              control={control}
                              name="password"
                              rules={{ required: REQUIRED_INVALID_MSG }}
                              placeholder="Пароль"
                            />
                            <FormErrorMessage>
                              {errors.password?.message}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </div>
                      <div>
                        <Divider orientation="vertical" mx={4} />
                      </div>
                      <div className={styles.form_column}>
                        <FormControl isRequired isInvalid={!!errors.roles}>
                          <FormLabel>Роли</FormLabel>
                          <SelectFormField
                            control={control}
                            name="roles"
                            placeholder="Роли"
                            rules={{ required: REQUIRED_INVALID_MSG }}
                            options={roles}
                            isMulti
                            getOptionLabel={(option: any) => option.name}
                            getOptionValue={(option: any) => option.id}
                          />
                          <FormErrorMessage>
                            {errors.roles?.message}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl isRequired isInvalid={!!errors.apps}>
                          <FormLabel>Доступные приложения</FormLabel>
                          <SelectFormField
                            control={control}
                            name="apps"
                            placeholder="Приложения"
                            rules={{ required: REQUIRED_INVALID_MSG }}
                            options={apps}
                            isMulti
                            getOptionLabel={(option: any) => option.description}
                            getOptionValue={(option: any) => option.id}
                          />
                          <FormErrorMessage>
                            {errors.apps?.message}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isRequired
                          isInvalid={!!errors.departments}
                        >
                          <FormLabel>Отделы</FormLabel>
                          <SelectFormField
                            control={control}
                            name="departments"
                            placeholder="Отделы"
                            rules={{ required: REQUIRED_INVALID_MSG }}
                            options={departments}
                            isMulti
                            getOptionLabel={(option: any) => option.name}
                            getOptionValue={(option: any) => option.id}
                          />
                          <FormErrorMessage>
                            {errors.departments?.message}
                          </FormErrorMessage>
                        </FormControl>
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
                  </form>
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
