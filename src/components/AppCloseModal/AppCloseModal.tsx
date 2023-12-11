import Modal from 'components/Modal/Modal';
import Button, { ButtonVariants } from 'components/UI/Button/Button';
import { defaultAvatar } from 'constants/images';
import { INITIAL_SETTINGS_ROUTE, LOGIN_ROUTE } from 'constants/paths';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { modalSlice } from 'store/reducers/ModalSlice';
import styles from './AppCloseModal.module.scss';
import { setToken } from 'helpers/localStorage';

const AUTO_CLOSE_ROUTES = [LOGIN_ROUTE, INITIAL_SETTINGS_ROUTE];

const AppCloseModal = () => {
  const appCloseModal = useAppSelector((state) => state.modal.appCloseModal);
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    window.electron.ipcRenderer.on('app-close', () => {
      if (AUTO_CLOSE_ROUTES.includes(location.pathname)) {
        close();
      } else {
        dispatch(modalSlice.actions.openModal({ modal: 'appCloseModal' }));
      }
    });

    return () => window.electron.ipcRenderer.removeAllListeners('app-close');
  }, [location.pathname]);

  const closeAndSignOut = () => {
    setToken('');
    close();
  };

  const closeModal = () => {
    dispatch(modalSlice.actions.closeModal('appCloseModal'));
  };

  return (
    <Modal isShowing={appCloseModal.isShowing} hide={closeModal}>
      <div className={styles.container}>
        <img
          className={styles.avatar}
          src={employee?.avatar || defaultAvatar}
        />
        <b>{employee?.name}</b>
        <Button onClick={closeAndSignOut}>Закрыть и выйти из аккаунта</Button>
        <Button variant={ButtonVariants.primary} onClick={close}>
          Закрыть
        </Button>
      </div>
    </Modal>
  );
};

export default AppCloseModal;
