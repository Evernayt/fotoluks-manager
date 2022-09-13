import {
  Accordion,
  Button,
  MaskedTextbox,
  Modal,
  Textbox,
  UserCard,
} from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { firstLetterToUpperCase } from 'helpers';
import { useModal } from 'hooks';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchUserByPhoneAPI, registrationAPI } from 'http/userAPI';
import { GlobalMessageVariants } from 'models/IGlobalMessage';
import { IUser, UserRoles } from 'models/IUser';
import { useEffect, useState } from 'react';
import { appSlice } from 'store/reducers/AppSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { orderSlice } from 'store/reducers/OrderSlice';
import { v4 as uuidv4 } from 'uuid';
import styles from './UserRegistrationModal.module.css';

const UserRegistrationModal = () => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [vk, setVk] = useState<string>('');
  const [telegram, setTelegram] = useState<string>('');
  const [user, setUser] = useState<IUser | null>(null);

  const userRegistrationModal = useAppSelector(
    (state) => state.modal.userRegistrationModal
  );
  const activeShop = useAppSelector((state) => state.app.activeShop);

  const additionalAccordion = useModal();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userRegistrationModal.isShowing) {
      if (userRegistrationModal.text !== '') {
        let numbers = userRegistrationModal.text
          .split(/([0-9]+)/)
          .filter((token) => token.match(/[0-9]/))
          .join('');

        if (!numbers) {
          numbers = '';
        } else if (numbers.startsWith('8')) {
          numbers = numbers.substring(0, 11);
        } else {
          numbers = '8' + numbers.substring(0, 10);
        }

        const words = userRegistrationModal.text
          .split(/([а-яА-Я]+)/)
          .filter((token) => token.match(/[а-яА-Я]/))
          .join('');

        setName(words);
        setPhone(numbers);
      }
    }
  }, [userRegistrationModal.isShowing]);

  const registration = () => {
    fetchUserByPhoneAPI(phone).then((data) => {
      if (data) {
        setUser(data);
      } else {
        setUser(null);
        const user: IUser = {
          id: 0,
          name: firstLetterToUpperCase(name),
          login: phone,
          password: uuidv4(),
          avatar: '',
          role: UserRoles.USER,
          phone,
          email: email.toLowerCase(),
          vk: vk.toLowerCase(),
          telegram: telegram.toLowerCase(),
          shopId: activeShop.id,
        };

        registrationAPI(user)
          .then((data2) => {
            dispatch(orderSlice.actions.setOrderUser(data2));
            close();
          })
          .catch((e) =>
            dispatch(
              appSlice.actions.showGlobalMessage({
                message: e.response.data.message,
                variant: GlobalMessageVariants.danger,
                isShowing: true,
              })
            )
          );
      }
    });
  };

  const selectUser = () => {
    if (user) {
      dispatch(orderSlice.actions.setOrderUser(user));
      close();
    }
  };

  const close = () => {
    dispatch(modalSlice.actions.closeUserRegistrationModal());
    setUser(null);
  };

  return (
    <Modal
      title="Регистрация"
      isShowing={userRegistrationModal.isShowing}
      hide={close}
    >
      {user === null ? (
        <div className={styles.container}>
          <div className={styles.main_controls}>
            <Textbox
              label="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <MaskedTextbox
              label="Телефон"
              value={phone}
              setValue={setPhone}
              mask="8 (999) 999-99-99"
            />
          </div>
          <Accordion
            label="Дополнительные поля"
            isShowing={additionalAccordion.isShowing}
            toggle={additionalAccordion.toggle}
          >
            <div className={styles.social}>
              <Textbox
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
          </Accordion>
          <Button
            variant={ButtonVariants.primary}
            disabled={name === '' || phone.length < 11}
            style={{ marginTop: '12px' }}
            onClick={registration}
          >
            Зарегистрировать
          </Button>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.message}>
            Данный номер телефона уже зарегистрирован.
          </div>
          <UserCard user={user} close={() => setUser(null)} />
          <div className={styles.controls}>
            <Button onClick={() => setUser(null)}>Назад</Button>
            <Button variant={ButtonVariants.primary} onClick={selectUser}>
              Выбрать
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UserRegistrationModal;
