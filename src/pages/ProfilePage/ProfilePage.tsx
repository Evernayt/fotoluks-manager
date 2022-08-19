import { Button, Navmenu, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { updateUserAPI, updateUserPasswordAPI } from 'http/userAPI';
import { useEffect, useState } from 'react';
import { userSlice } from 'store/reducers/UserSlice';
import ProfileAvatar from './ProfileAvatar/ProfileAvatar';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const [name, setName] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [userMessage, setUserMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');

  const user = useAppSelector((state) => state.user.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) return;

    setName(user.name);
    setLogin(user.login);
  }, []);

  const updateUser = () => {
    if (!user) return;

    const updatedUser = { ...user, name, login };
    updateUserAPI(updatedUser)
      .then((data) => {
        setUserMessage('');
        dispatch(userSlice.actions.updateUser(data));
      })
      .catch((e) => setUserMessage(e.response.data.message));
  };

  const updateUserPassword = () => {
    if (!user) return;

    updateUserPasswordAPI(user.id, oldPassword, newPassword)
      .then(() => {
        setPasswordMessage('');
        setOldPassword('');
        setNewPassword('');
      })
      .catch((e) => setPasswordMessage(e.response.data.message));
  };

  return (
    <div className={styles.container}>
      <Navmenu />
      <div className={styles.panel}>
        <div>
          <ProfileAvatar />
        </div>

        <div className={styles.controls}>
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
          {userMessage !== '' && (
            <div className={styles.error_message}>{userMessage}</div>
          )}
          <Button
            variant={ButtonVariants.primary}
            style={{ marginBottom: '24px' }}
            disabled={name === '' || login === ''}
            onClick={updateUser}
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
          {passwordMessage !== '' && (
            <div className={styles.error_message}>{passwordMessage}</div>
          )}
          <Button
            variant={ButtonVariants.primary}
            disabled={oldPassword === '' || newPassword === ''}
            onClick={updateUserPassword}
          >
            Изменить пароль
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
