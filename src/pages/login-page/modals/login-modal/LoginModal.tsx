import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Input,
  FormControl,
  useToast,
  Avatar,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';
import AuthAPI from 'api/AuthAPI/AuthAPI';
import socketio from 'socket/socketio';
import MoyskladAPI from 'api/MoyskladAPI/MoyskladAPI';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import { employeeActions } from 'store/reducers/EmployeeSlice';
import { getRecentLogins, setRecentLogins } from 'helpers/localStorage';
import { IEmployee } from 'models/api/IEmployee';
import { useNavigate } from 'react-router-dom';
import StatusAPI from 'api/StatusAPI/StatusAPI';
import { orderActions } from 'store/reducers/OrderSlice';
import { IconKey } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE, REQUIRED_INVALID_MSG } from 'constants/app';
import * as Yup from 'yup';
import { getEmployeeApps, getEmployeeFullName } from 'helpers/employee';
import RoleAPI from 'api/RoleAPI/RoleAPI';
import { appActions } from 'store/reducers/AppSlice';
import AppAPI from 'api/AppAPI/AppAPI';
import DepartmentAPI from 'api/DepartmentAPI/DepartmentAPI';
import ShopAPI from 'api/ShopAPI/ShopAPI';
import { getStoreByShop } from 'helpers/moysklad';
import FavoriteAPI from 'api/FavoriteAPI/FavoriteAPI';
import { getErrorToast } from 'helpers/toast';
import { PasswordInput } from 'components';
import styles from './LoginModal.module.scss';

interface Values {
  password: string;
}

const formSchema = Yup.object({
  password: Yup.string().required(REQUIRED_INVALID_MSG),
});

const LoginModal = () => {
  const { isOpen, employee } = useAppSelector(
    (state) => state.modal.loginModal
  );
  const activeShop = useAppSelector((state) => state.app.activeShop);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

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

  const signIn = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
    const { password } = values;
    AuthAPI.login({ login: employee?.login, password })
      .then((data) => {
        const apps = getEmployeeApps(data.apps);
        if (!apps.length) {
          toast(getErrorToast('У вас нет доступных приложений', ''));
          return;
        }
        socketio.connect(data.id);

        fetchShopsWithGeneral();
        fetchStores();
        fetchStatuses();
        fetchRoles();
        fetchApps();
        fetchDepartments();
        fetchDepartmentsWithGeneral();
        fetchFavorites(data.id);

        dispatch(employeeActions.signIn(data));
        navigate(apps[0].value);
        addRecentLogin(data);
        closeModal();
      })
      .catch((e) => toast(getErrorToast('AuthForm.signIn', e)))
      .finally(() => setSubmitting(false));
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

  const closeModal = () => {
    dispatch(modalActions.closeModal('loginModal'));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody className={styles.body}>
          <Avatar
            name={getEmployeeFullName(employee)}
            src={employee?.avatar || undefined}
            boxSize="150px"
            size="2xl"
          />
          <Text>{employee?.name}</Text>
          <Formik
            initialValues={{ password: '' }}
            validationSchema={formSchema}
            onSubmit={signIn}
          >
            {(props) => (
              <Form className={styles.form}>
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
                        <PasswordInput
                          {...field}
                          pl="35px"
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
