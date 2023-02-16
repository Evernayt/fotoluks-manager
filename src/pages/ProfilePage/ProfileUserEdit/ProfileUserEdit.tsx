import EmployeeAPI from 'api/EmployeeAPI/EmployeeAPI';
import { Button, Textbox } from 'components';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { employeeSlice } from 'store/reducers/EmployeeSlice';
import styles from './ProfileUserEdit.module.scss';

const ProfileUserEdit = () => {
  const [name, setName] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!employee) return;

    setName(employee.name);
    setLogin(employee.login);
  }, []);

  const updateEmployee = () => {
    if (!employee) return;

    const updatedEmployee = { ...employee, name, login };
    EmployeeAPI.update(updatedEmployee)
      .then((data) => {
        dispatch(employeeSlice.actions.updateEmployee(data));
      })
      .catch((e) => showGlobalMessage(e.response.data.message));
  };

  const updateEmployeePassword = () => {
    if (!employee) return;

    EmployeeAPI.updatePassword({
      id: employee.id,
      oldPassword,
      newPassword,
    })
      .then(() => {
        setOldPassword('');
        setNewPassword('');
      })
      .catch((e) => showGlobalMessage(e.response.data.message));
  };

  return (
    <div className={styles.container}>
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
      <Button
        variant={ButtonVariants.primary}
        style={{ marginBottom: '24px' }}
        disabled={name === '' || login === ''}
        onClick={updateEmployee}
      >
        Изменить
      </Button>
      <Textbox
        label="Старый пароль"
        isPassword
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <Textbox
        label="Новый пароль"
        isPassword
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Button
        variant={ButtonVariants.primary}
        disabled={oldPassword === '' || newPassword === ''}
        onClick={updateEmployeePassword}
      >
        Изменить пароль
      </Button>
    </div>
  );
};

export default ProfileUserEdit;
