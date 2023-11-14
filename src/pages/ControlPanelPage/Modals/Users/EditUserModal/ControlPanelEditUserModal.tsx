import { Avatar, Button, MaskedTextbox, Modal, Textbox } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { defaultAvatar } from 'constants/images';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './ControlPanelEditUserModal.module.scss';
import { IUser } from 'models/api/IUser';
import UserAPI from 'api/UserAPI/UserAPI';
import VerificationAPI from 'api/VerificationAPI/VerificationAPI';
import { UpdateUserDto } from 'api/UserAPI/dto/update-user.dto';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';
import { Modes } from 'constants/app';
import AuthAPI from 'api/AuthAPI/AuthAPI';
import FileAPI from 'api/FileAPI/FileAPI';

const ControlPanelEditUserModal = () => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [vk, setVk] = useState<string>('');
  const [telegram, setTelegram] = useState<string>('');
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>();

  const editUserModal = useAppSelector(
    (state) => state.modal.controlPanelEditUserModal
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editUserModal.isShowing) {
      if (editUserModal.mode === Modes.EDIT_MODE) {
        fetchUser();
      }
    }
  }, [editUserModal.isShowing]);

  const fetchUser = () => {
    UserAPI.getOne(editUserModal.userId).then((data) => {
      setName(data.name);
      setPhone(data.phone);
      setAvatar(data.avatar || '');
      setEmail(data.email);
      setVk(data.vk);
      setTelegram(data.telegram);
      setUser(data);

      VerificationAPI.isVerified(data.phone).then((data2) => {
        setIsPhoneVerified(data2.phoneVerified);
      });
    });
  };

  const close = () => {
    dispatch(modalSlice.actions.closeModal('controlPanelEditUserModal'));
    setIsPhoneVerified(false);
    setName('');
    setPhone('');
    setPassword('');
    setAvatar('');
    setEmail('');
    setVk('');
    setTelegram('');
    setUser(undefined);
  };

  const updateUser = () => {
    const updatedUser: UpdateUserDto = {
      id: user?.id,
      name,
      phone,
      email,
      vk,
      telegram,
    };
    UserAPI.update(updatedUser)
      .then(() => {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        close();
      })
      .catch((e) =>
        showGlobalMessage(e.response.data ? e.response.data.message : e.message)
      );
  };

  const registrationUser = () => {
    AuthAPI.registrationUser({ name, phone, password }).then(() => {
      dispatch(controlPanelSlice.actions.setForceUpdate(true));
      close();
    });
  };

  const editAvatar = (image: File) => {
    FileAPI.uploadAvatar(image).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          if (user) {
            const updatedUser: UpdateUserDto = {
              id: user.id,
              avatar: data.link,
            };
            UserAPI.update(updatedUser).then(() => {
              setAvatar(data.link);
            });
          }
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
        editUserModal.mode === Modes.EDIT_MODE
          ? 'Редактирование'
          : 'Новый клиент'
      }
      isShowing={editUserModal.isShowing}
      hide={close}
    >
      <div className={styles.container}>
        {editUserModal.mode === Modes.EDIT_MODE && (
          <div className={styles.avatar_container}>
            <Avatar
              image={avatar ? avatar : defaultAvatar}
              size={120}
              onAvatarSelect={editAvatar}
            />
            {isPhoneVerified && (
              <div className={styles.message}>
                {`Пользователь активировал аккаунт.\nНекоторые данные изменить нельзя.`}
                <Button
                  variant={ButtonVariants.link}
                  style={{ width: 'max-content', padding: 0 }}
                  onClick={() => setIsPhoneVerified(false)}
                >
                  Разблокировать
                </Button>
              </div>
            )}
          </div>
        )}

        <div className={styles.inputs}>
          <Textbox
            label="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPhoneVerified}
          />
          <MaskedTextbox
            label="Телефон"
            value={phone}
            setValue={setPhone}
            mask="8 (999) 999-99-99"
            disabled={isPhoneVerified}
          />
        </div>
        {editUserModal.mode === Modes.ADD_MODE && (
          <Textbox
            label="Пароль"
            value={password}
            isPassword={true}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        <Textbox
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className={styles.inputs}>
          <Textbox
            label="ВКонтакте"
            value={vk}
            onChange={(e) => setVk(e.target.value)}
          />
          <Textbox
            label="Telegram"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
          />
        </div>
        <div className={styles.controls}>
          <Button onClick={close}>Отменить</Button>
          {editUserModal.mode === Modes.ADD_MODE ? (
            <Button
              variant={ButtonVariants.primary}
              disabled={name === '' || phone?.length < 11 || password === ''}
              onClick={registrationUser}
            >
              Зарегистрировать
            </Button>
          ) : (
            <Button
              variant={ButtonVariants.primary}
              disabled={name === '' || phone?.length < 11}
              onClick={updateUser}
            >
              Изменить
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ControlPanelEditUserModal;
