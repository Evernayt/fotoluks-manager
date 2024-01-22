import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { LOGIN_ROUTE } from 'constants/paths';
import { getEmployeeFullName } from 'helpers/employee';
import { setToken } from 'helpers/localStorage';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { modalActions } from 'store/reducers/ModalSlice';
import { IconLogout } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import styles from './AppCloseModal.module.scss';

const AUTO_CLOSE_ROUTES = [LOGIN_ROUTE];

const AppCloseModal = () => {
  const { isOpen } = useAppSelector((state) => state.modal.appCloseModal);
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    window.electron.ipcRenderer.on('app-close', () => {
      if (AUTO_CLOSE_ROUTES.includes(location.pathname)) {
        close();
      } else {
        dispatch(modalActions.openModal({ modal: 'appCloseModal' }));
      }
    });

    return () => window.electron.ipcRenderer.removeAllListeners('app-close');
  }, [location.pathname]);

  const closeAndSignOut = () => {
    setToken('');
    close();
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('appCloseModal'));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody className={styles.container} p="var(--space-modal)">
          <Avatar
            src={employee?.avatar || undefined}
            name={getEmployeeFullName(employee)}
            size="2xl"
          />
          <Text as="b">{getEmployeeFullName(employee)}</Text>
          <Button
            leftIcon={<IconLogout size={ICON_SIZE} stroke={ICON_STROKE} />}
            w="100%"
            onClick={closeAndSignOut}
          >
            Закрыть и выйти из аккаунта
          </Button>
          <Button colorScheme="yellow" w="100%" onClick={close}>
            Закрыть приложение
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AppCloseModal;
