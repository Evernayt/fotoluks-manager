import { EditableAvatar } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import FileAPI from 'api/FileAPI/FileAPI';
import { UpdateEmployeeDto } from 'api/EmployeeAPI/dto/update-employee.dto';
import EmployeeAPI from 'api/EmployeeAPI/EmployeeAPI';
import { employeeActions } from 'store/reducers/EmployeeSlice';
import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { IEmployee } from 'models/api/IEmployee';
import { getRecentLogins, setRecentLogins } from 'helpers/localStorage';
import * as Yup from 'yup';
import { REQUIRED_INVALID_MSG } from 'constants/app';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { getErrorToast, getSuccessToast } from 'helpers/toast';
import styles from './ProfileEmployeeEdit.module.scss';

interface EmployeeFormValues {
  name: string;
  surname: string;
  login: string;
}

interface PasswordFormValues {
  oldPassword: string;
  newPassword: string;
}

const INITIAL_PASSWORD_FORM_STATE: PasswordFormValues = {
  oldPassword: '',
  newPassword: '',
};

const employeeFormSchema = Yup.object({
  name: Yup.string().required(REQUIRED_INVALID_MSG),
  surname: Yup.string().required(REQUIRED_INVALID_MSG),
  login: Yup.string().required(REQUIRED_INVALID_MSG),
});

const passwordFormSchema = Yup.object({
  oldPassword: Yup.string().required(REQUIRED_INVALID_MSG),
  newPassword: Yup.string().required(REQUIRED_INVALID_MSG),
});

const ProfileEmployeeEdit = () => {
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();
  const toast = useToast();

  const editAvatar = (image: File) => {
    if (!employee) return;
    FileAPI.uploadAvatar(image).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          const updatedEmployee: UpdateEmployeeDto = {
            id: employee.id,
            avatar: data.link,
          };
          EmployeeAPI.update(updatedEmployee)
            .then((data) => {
              updateEmployeeState(data);
            })
            .catch((e) =>
              toast(getErrorToast('ProfileEmployeeEdit.editAvatar', e))
            );
        });
      } else {
        res
          .json()
          .then((data) =>
            toast(
              getErrorToast(
                'ProfileEmployeeEdit.editAvatar.uploadAvatar',
                data.message
              )
            )
          );
      }
    });
  };

  const removeAvatar = () => {
    if (!employee || !employee.avatar) return;
    const updatedEmployee: UpdateEmployeeDto = {
      id: employee.id,
      avatar: null,
    };
    EmployeeAPI.update(updatedEmployee)
      .then((data) => {
        updateEmployeeState(data);
      })
      .catch((e) =>
        toast(getErrorToast('ProfileEmployeeEdit.removeAvatar', e))
      );
  };

  const updateEmployeeState = (employee: IEmployee) => {
    const recentLogins = getRecentLogins();
    const updatedRecentLogins = recentLogins.map((recentLogin) =>
      recentLogin.id === employee.id
        ? { ...employee, password: recentLogin.password }
        : recentLogin
    );
    setRecentLogins(updatedRecentLogins);
    dispatch(employeeActions.updateEmployee(employee));
  };

  const updateEmployee = (
    values: EmployeeFormValues,
    { setSubmitting }: FormikHelpers<EmployeeFormValues>
  ) => {
    if (!employee) return;
    const { name, surname, login } = values;
    const updatedEmployee: UpdateEmployeeDto = {
      id: employee.id,
      name,
      surname,
      login,
    };
    EmployeeAPI.update(updatedEmployee)
      .then((data) => {
        updateEmployeeState(data);
        toast(getSuccessToast('Данные изменены'));
      })
      .catch((e) =>
        toast(getErrorToast('ProfileEmployeeEdit.updateEmployee', e))
      )
      .finally(() => setSubmitting(false));
  };

  const updatePassword = (
    values: PasswordFormValues,
    { setSubmitting, resetForm }: FormikHelpers<PasswordFormValues>
  ) => {
    if (!employee) return;
    const { oldPassword, newPassword } = values;
    EmployeeAPI.updatePassword({
      id: employee.id,
      oldPassword,
      newPassword,
    })
      .then(() => {
        resetForm();
        toast(getSuccessToast('Пароль изменен'));
      })
      .catch((e) =>
        toast(getErrorToast('ProfileEmployeeEdit.updatePassword', e))
      )
      .finally(() => setSubmitting(false));
  };

  return (
    <div className={styles.container}>
      <EditableAvatar
        avatar={employee?.avatar}
        onAvatarSelect={editAvatar}
        onAvatarRemove={removeAvatar}
      />
      <div>
        <Divider orientation="vertical" mx={6} />
      </div>
      <Formik
        initialValues={{
          name: employee?.name || '',
          surname: employee?.surname || '',
          login: employee?.login || '',
        }}
        validationSchema={employeeFormSchema}
        enableReinitialize
        onSubmit={updateEmployee}
      >
        {(props) => (
          <Form className={styles.form}>
            <Field name="name">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!meta.error && meta.touched}>
                  <FormLabel>Имя</FormLabel>
                  <Input
                    {...field}
                    placeholder="Имя"
                    isDisabled={props.isSubmitting}
                  />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="surname">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!meta.error && meta.touched}>
                  <FormLabel>Фамилия</FormLabel>
                  <Input
                    {...field}
                    placeholder="Фамилия"
                    isDisabled={props.isSubmitting}
                  />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="login">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!meta.error && meta.touched}>
                  <FormLabel>Логин</FormLabel>
                  <Input
                    {...field}
                    placeholder="Логин"
                    isDisabled={props.isSubmitting}
                  />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button isLoading={props.isSubmitting} type="submit" w="100%">
              Изменить
            </Button>
          </Form>
        )}
      </Formik>
      <div>
        <Divider orientation="vertical" mx={6} />
      </div>
      <Formik
        initialValues={INITIAL_PASSWORD_FORM_STATE}
        validationSchema={passwordFormSchema}
        enableReinitialize
        onSubmit={updatePassword}
      >
        {(props) => (
          <Form className={styles.form}>
            <Field name="oldPassword">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!meta.error && meta.touched}>
                  <FormLabel>Старый пароль</FormLabel>
                  <Input
                    {...field}
                    placeholder="Старый пароль"
                    isDisabled={props.isSubmitting}
                  />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="newPassword">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!meta.error && meta.touched}>
                  <FormLabel>Новый пароль</FormLabel>
                  <Input
                    {...field}
                    placeholder="Новый пароль"
                    isDisabled={props.isSubmitting}
                  />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button isLoading={props.isSubmitting} type="submit" w="100%">
              Изменить пароль
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileEmployeeEdit;
