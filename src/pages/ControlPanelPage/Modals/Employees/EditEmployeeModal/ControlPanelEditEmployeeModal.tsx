import {
  Accordion,
  Avatar,
  Button,
  DropdownButton,
  IconButton,
  Loader,
  Modal,
  SelectButton,
  Textbox,
} from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { defaultAvatar } from 'constants/images';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import styles from './ControlPanelEditEmployeeModal.module.scss';
import EmployeeAPI from 'api/EmployeeAPI/EmployeeAPI';
import { UpdateEmployeeDto } from 'api/EmployeeAPI/dto/update-employee.dto';
import { Modes } from 'constants/app';
import AuthAPI from 'api/AuthAPI/AuthAPI';
import FileAPI from 'api/FileAPI/FileAPI';
import { employeeSlice } from 'store/reducers/EmployeeSlice';
import { IApp } from 'models/api/IApp';
import { IDepartment } from 'models/api/IDepartment';
import { IconMinus, IconPlus } from 'icons';
import { Placements } from 'helpers/calcPlacement';
import { IDropdownButtonOption } from 'components/UI/DropdownButton/DropdownButton';
import AppAPI from 'api/AppAPI/AppAPI';
import { useModal } from 'hooks';
import DepartmentAPI from 'api/DepartmentAPI/DepartmentAPI';
import { IRole } from 'models/api/IRole';
import RoleAPI from 'api/RoleAPI/RoleAPI';
import { INITIAL_ROLE } from 'constants/states/role-states';
import { CreateEmployeeDto } from 'api/EmployeeAPI/dto/create-employee.dto';

const ControlPanelEditEmployeeModal = () => {
  const [name, setName] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<number>();
  const [apps, setApps] = useState<IApp[]>([]);
  const [appOptions, setAppOptions] = useState<IDropdownButtonOption[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [departmentOptions, setDepartmentsOptions] = useState<
    IDropdownButtonOption[]
  >([]);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<IRole>(INITIAL_ROLE);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const editEmployeeModal = useAppSelector(
    (state) => state.modal.controlPanelEditEmployeeModal
  );
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();
  const appsAccordion = useModal();
  const departmentsAccordion = useModal();

  useEffect(() => {
    if (editEmployeeModal.isShowing) {
      if (editEmployeeModal.mode === Modes.EDIT_MODE) {
        Promise.all([fetchEmployee(), fetchRoles()]).finally(() =>
          setIsLoading(false)
        );
      } else {
        fetchRoles().finally(() => setIsLoading(false));
        createAppOptions([]);
        createDepartmentOptions([]);
      }
    }
  }, [editEmployeeModal.isShowing]);

  const fetchEmployee = async () => {
    const data = await EmployeeAPI.getOne(editEmployeeModal.employeeId);
    setName(data.name);
    setLogin(data.login);
    setAvatar(data.avatar || '');
    setEmployeeId(data.id);
    if (data.role) setSelectedRole(data.role);
    if (data.apps) {
      setApps(data.apps);
      createAppOptions(data.apps);
    }
    if (data.departments) {
      setDepartments(data.departments);
      createDepartmentOptions(data.departments);
    }
  };

  const fetchRoles = async () => {
    const data = await RoleAPI.getAll();
    setRoles(data.rows);
  };

  const createAppOptions = (apps: IApp[]) => {
    AppAPI.getAll().then((data) => {
      const options: IDropdownButtonOption[] = [];
      data.rows.forEach((dataApp) => {
        const foundApp = apps.find((app) => app.id === dataApp.id);

        if (!foundApp) {
          options.push({
            id: dataApp.id,
            name: dataApp.description,
            onClick: () => {
              setApps((prevState) => {
                return (prevState = [...prevState, dataApp]);
              });

              setAppOptions((prevState) =>
                prevState.filter((state) => state.id !== dataApp.id)
              );
            },
          });
        }
      });
      setAppOptions(options);
    });
  };

  const createDepartmentOptions = (departments: IDepartment[]) => {
    DepartmentAPI.getAll().then((data) => {
      const options: IDropdownButtonOption[] = [];
      data.rows.forEach((dataDepartment) => {
        const foundDepartment = departments.find(
          (department) => department.id === dataDepartment.id
        );

        if (!foundDepartment) {
          options.push({
            id: dataDepartment.id,
            name: dataDepartment.name,
            onClick: () => {
              setDepartments((prevState) => {
                return (prevState = [...prevState, dataDepartment]);
              });

              setDepartmentsOptions((prevState) =>
                prevState.filter((state) => state.id !== dataDepartment.id)
              );
            },
          });
        }
      });
      setDepartmentsOptions(options);
    });
  };

  const removeApp = (app: IApp) => {
    const removedApps = apps.filter((state) => state.id !== app.id);

    setApps(removedApps);
    createAppOptions(removedApps);
  };

  const removeDepartment = (department: IDepartment) => {
    const removedDepartments = departments.filter(
      (state) => state.id !== department.id
    );

    setDepartments(removedDepartments);
    createDepartmentOptions(removedDepartments);
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('controlPanelEditEmployeeModal'));
    setName('');
    setLogin('');
    setPassword('');
    setAvatar('');
    setEmployeeId(0);
    setApps([]);
    setDepartments([]);
    setAppOptions([]);
    setDepartmentsOptions([]);
    setRoles([]);
    setSelectedRole(INITIAL_ROLE);
    setIsLoading(true);
  };

  const updateEmployee = () => {
    if (employeeId === 0) return;

    const appIds: number[] = [];
    const departmentIds: number[] = [];
    apps.forEach((app) => appIds.push(app.id));
    departments.forEach((department) => departmentIds.push(department.id));

    const updatedEmployee: UpdateEmployeeDto = {
      id: employeeId,
      name,
      login,
      roleId: selectedRole.id,
    };
    EmployeeAPI.update(updatedEmployee)
      .then((data) => {
        if (appIds.length) {
          EmployeeAPI.addApp({ appIds, employeeId: data.id });
        }
        if (departmentIds.length) {
          EmployeeAPI.addDepartment({ departmentIds, employeeId: data.id });
        }
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        close();
      })
      .catch((e) =>
        showGlobalMessage(e.response.data ? e.response.data.message : e.message)
      );
  };

  const registrationEmployee = () => {
    const appIds: number[] = [];
    const departmentIds: number[] = [];
    apps.forEach((app) => appIds.push(app.id));
    departments.forEach((department) => departmentIds.push(department.id));

    const createdEmployee: CreateEmployeeDto = {
      name,
      login,
      password,
      roleId: selectedRole.id,
    };
    AuthAPI.registration(createdEmployee).then((data) => {
      if (appIds.length) {
        EmployeeAPI.addApp({ appIds, employeeId: data.id });
      }
      if (departmentIds.length) {
        EmployeeAPI.addDepartment({ departmentIds, employeeId: data.id });
      }
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  const editAvatar = (image: File) => {
    if (employeeId === 0) return;
    FileAPI.uploadAvatar(image).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          const updatedEmployee: UpdateEmployeeDto = {
            id: employeeId,
            avatar: data.link,
          };
          EmployeeAPI.update(updatedEmployee).then((data2) => {
            setAvatar(data.link);
            if (data2.id === employee?.id) {
              dispatch(employeeSlice.actions.updateEmployee(data2));
            }
          });
        });
      } else {
        res.json().then((data) => {
          showGlobalMessage(data.message);
        });
      }
    });
  };

  return (
    <Modal
      title={
        editEmployeeModal.mode === Modes.EDIT_MODE
          ? 'Редактирование'
          : 'Новый сотрудник'
      }
      isShowing={editEmployeeModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        {isLoading ? (
          <Loader height="255px" />
        ) : (
          <>
            {editEmployeeModal.mode === Modes.EDIT_MODE && (
              <div className={styles.avatar_container}>
                <Avatar
                  image={avatar ? avatar : defaultAvatar}
                  size={120}
                  onAvatarSelect={editAvatar}
                />
              </div>
            )}
            <div className={styles.inputs}>
              <Textbox
                label="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Textbox
                label="Логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <SelectButton
              title="Роль"
              items={roles}
              defaultSelectedItem={selectedRole}
              onChange={setSelectedRole}
            />
            {editEmployeeModal.mode === Modes.ADD_MODE && (
              <Textbox
                label="Пароль"
                value={password}
                isPassword={true}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
            <Accordion
              label="Доступные приложения"
              isShowing={appsAccordion.isShowing}
              toggle={appsAccordion.toggle}
            >
              <div className={styles.options_container}>
                {apps.map((app) => (
                  <div className={styles.option_item} key={app.id}>
                    {app.description}
                    <IconButton
                      icon={<IconMinus className="secondary-icon" />}
                      style={{ minHeight: '32px', padding: '4px' }}
                      onClick={() => removeApp(app)}
                    />
                  </div>
                ))}
                <DropdownButton
                  options={appOptions}
                  icon={<IconPlus className="secondary-icon" />}
                  placement={Placements.rightStart}
                />
              </div>
            </Accordion>
            <Accordion
              label="Отделы"
              isShowing={departmentsAccordion.isShowing}
              toggle={departmentsAccordion.toggle}
            >
              <div className={styles.options_container}>
                {departments.map((department) => (
                  <div className={styles.option_item} key={department.id}>
                    {department.name}
                    <IconButton
                      icon={<IconMinus className="secondary-icon" />}
                      style={{ minHeight: '32px', padding: '4px' }}
                      onClick={() => removeDepartment(department)}
                    />
                  </div>
                ))}
                <DropdownButton
                  options={departmentOptions}
                  icon={<IconPlus className="secondary-icon" />}
                  placement={Placements.rightStart}
                />
              </div>
            </Accordion>
            <div className={styles.controls}>
              <Button onClick={close}>Отменить</Button>
              {editEmployeeModal.mode === Modes.ADD_MODE ? (
                <Button
                  variant={ButtonVariants.primary}
                  disabled={
                    name === '' ||
                    login === '' ||
                    password === '' ||
                    selectedRole === INITIAL_ROLE
                  }
                  onClick={registrationEmployee}
                >
                  Зарегистрировать
                </Button>
              ) : (
                <Button
                  variant={ButtonVariants.primary}
                  disabled={
                    name === '' || login === '' || selectedRole === INITIAL_ROLE
                  }
                  onClick={updateEmployee}
                >
                  Изменить
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ControlPanelEditEmployeeModal;
