import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Card,
  CardBody,
  Button,
  Divider,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps, FormikHelpers } from 'formik';
import { FC, useEffect, useState } from 'react';
import { SelectField } from 'components/ui/select/Select';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useNavigate } from 'react-router-dom';
import ShopAPI from 'api/ShopAPI/ShopAPI';
import { IShop } from 'models/api/IShop';
import { IEmployee } from 'models/api/IEmployee';
import {
  getActiveShop,
  getRecentLogins,
  getToken,
  setActiveShop,
  setRecentLogins,
} from 'helpers/localStorage';
import { appActions } from 'store/reducers/AppSlice';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import AuthAPI from 'api/AuthAPI/AuthAPI';
import socketio from 'socket/socketio';
import { employeeActions } from 'store/reducers/EmployeeSlice';
import StatusAPI from 'api/StatusAPI/StatusAPI';
import { orderActions } from 'store/reducers/OrderSlice';
import { IconKey, IconUserCircle } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE,
  REQUIRED_INVALID_MSG,
  SHOP_INVALID_MSG,
} from 'constants/app';
import * as Yup from 'yup';
import { getEmployeeApps } from 'helpers/employee';
import jwtDecode from 'jwt-decode';
import RoleAPI from 'api/RoleAPI/RoleAPI';
import AppAPI from 'api/AppAPI/AppAPI';
import DepartmentAPI from 'api/DepartmentAPI/DepartmentAPI';
import { getStoreByShop } from 'helpers/moysklad';
import FavoriteAPI from 'api/FavoriteAPI/FavoriteAPI';
import { getErrorToast } from 'helpers/toast';
import styles from './AuthForm.module.scss';

interface FormValues {
  shopId: number;
  login: string;
  password: string;
}

const formSchema = Yup.object({
  shopId: Yup.number().min(1, SHOP_INVALID_MSG).required(SHOP_INVALID_MSG),
  login: Yup.string().required(REQUIRED_INVALID_MSG),
  password: Yup.string().required(REQUIRED_INVALID_MSG),
});

interface AuthFormProps {
  setIsAutoSignIn: (isAutoSignIn: boolean) => void;
}

const AuthForm: FC<AuthFormProps> = ({ setIsAutoSignIn }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const shops = useAppSelector((state) => state.app.shops);
  const activeShop = useAppSelector((state) => state.app.activeShop);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const shop = getActiveShop();
    if (shop) dispatch(appActions.setActiveShop(shop));

    autoSignIn();

    fetchShops();
  }, []);

  const fetchShops = () => {
    setIsLoading(true);
    ShopAPI.getAll()
      .then((data) => {
        dispatch(appActions.setShops(data.rows));
      })
      .catch((e) => toast(getErrorToast('AuthForm.fetchShops', e)))
      .finally(() => setIsLoading(false));
  };

  const fetchShopsWithGeneral = () => {
    ShopAPI.getAll({ isIncludeGeneral: true }).then((data) => {
      dispatch(appActions.setShopsWithGeneral(data.rows));
    });
  };

  const fetchStores = () => {
    MoyskladAPI.getStores().then((data) => {
      dispatch(moyskladActions.setStores(data.rows || []));
      const activeStore = getStoreByShop(activeShop, data.rows || []);
      if (activeStore) dispatch(moyskladActions.setActiveStore(activeStore));
    });
  };

  const fetchStatuses = () => {
    StatusAPI.getAll().then((data) => {
      dispatch(orderActions.setStatuses(data.rows));
    });
  };

  const fetchRoles = () => {
    RoleAPI.getAll().then((data) => {
      dispatch(appActions.setRoles(data.rows));
    });
  };

  const fetchApps = () => {
    AppAPI.getAll().then((data) => {
      dispatch(appActions.setApps(data.rows));
    });
  };

  const fetchDepartments = () => {
    DepartmentAPI.getAll().then((data) => {
      dispatch(appActions.setDepartments(data.rows));
    });
  };

  const fetchDepartmentsWithGeneral = () => {
    DepartmentAPI.getAll({ isIncludeGeneral: true }).then((data) => {
      dispatch(appActions.setDepartmentsWithGeneral(data.rows));
    });
  };

  const fetchFavorites = (employeeId: number) => {
    FavoriteAPI.getAll({ employeeId }).then((data) => {
      dispatch(orderActions.setFavorites(data.rows));
    });
  };

  const loggedIn = (employee: IEmployee) => {
    const apps = getEmployeeApps(employee.apps);
    if (!apps.length) {
      toast(getErrorToast('У вас нет доступных приложений', ''));
      return;
    }
    socketio.connect(employee.id);

    fetchShopsWithGeneral();
    fetchStores();
    fetchStatuses();
    fetchRoles();
    fetchApps();
    fetchDepartments();
    fetchDepartmentsWithGeneral();
    fetchFavorites(employee.id);

    dispatch(employeeActions.signIn(employee));
    navigate(apps[0].value);
    addRecentLogin(employee);
  };

  const signIn = (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    const { login, password } = values;
    AuthAPI.login({ login, password })
      .then((data) => loggedIn(data))
      .catch((e) => toast(getErrorToast('AuthForm.signIn', e)))
      .finally(() => setSubmitting(false));
  };

  const autoSignIn = () => {
    const token = getToken();
    if (token !== '') {
      const { login }: IEmployee = jwtDecode(token);
      AuthAPI.checkAuth(login)
        .then((data) => loggedIn(data))
        .catch((e) => toast(getErrorToast('AuthForm.signIn', e)))
        .finally(() => setIsAutoSignIn(false));
    } else {
      setIsAutoSignIn(false);
    }
  };

  const addRecentLogin = (employee: IEmployee) => {
    const recentLogins = getRecentLogins();
    for (let i = 0; i < recentLogins.length; i++) {
      if (recentLogins[i].id === employee.id) {
        return;
      }
    }
    if (recentLogins.length === 2) {
      recentLogins.shift();
    }
    recentLogins.push(employee);
    setRecentLogins(recentLogins);
  };

  const shopChangeHandler = (shop: IShop) => {
    dispatch(appActions.setActiveShop(shop));
    setActiveShop(shop);
  };

  return (
    <Card>
      <CardBody w={260}>
        <Formik
          initialValues={{
            shopId: activeShop.id,
            login: '',
            password: '',
          }}
          validationSchema={formSchema}
          enableReinitialize
          onSubmit={signIn}
        >
          {(props) => (
            <Form className={styles.form}>
              <Field name="shopId">
                {({ field, form, meta }: FieldProps) => (
                  <FormControl isInvalid={!!meta.error && meta.touched}>
                    <FormLabel>Филиал</FormLabel>
                    <SelectField
                      placeholder="Филиал"
                      value={activeShop.id === 0 ? null : activeShop}
                      options={shops}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      fieldProps={field}
                      formProps={form}
                      isDisabled={form.isSubmitting}
                      isLoading={isLoading}
                      onChange={shopChangeHandler}
                    />
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Divider my={2} />
              <Field name="login">
                {({ field, meta }: FieldProps) => (
                  <FormControl isInvalid={!!meta.error && meta.touched}>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <IconUserCircle
                          className="link-icon"
                          size={ICON_SIZE}
                          stroke={ICON_STROKE}
                        />
                      </InputLeftElement>
                      <Input
                        {...field}
                        placeholder="Логин"
                        isDisabled={props.isSubmitting}
                      />
                    </InputGroup>
                  </FormControl>
                )}
              </Field>
              <Field name="password">
                {({ field, meta }: FieldProps) => (
                  <FormControl isInvalid={!!meta.error && meta.touched}>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <IconKey
                          className="link-icon"
                          size={ICON_SIZE}
                          stroke={ICON_STROKE}
                        />
                      </InputLeftElement>
                      <Input
                        {...field}
                        placeholder="Пароль"
                        type="password"
                        isDisabled={props.isSubmitting}
                      />
                    </InputGroup>
                  </FormControl>
                )}
              </Field>
              <Button
                className={styles.auth_button}
                isLoading={props.isSubmitting}
                loadingText="Авторизация"
                type="submit"
                colorScheme="yellow"
              >
                Войти
              </Button>
            </Form>
          )}
        </Formik>
      </CardBody>
    </Card>
  );
};

export default AuthForm;
