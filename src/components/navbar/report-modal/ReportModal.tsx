import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react';
import AutoResizableTextarea from 'components/ui/auto-resizable-textarea/AutoResizableTextarea';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';
import { useState } from 'react';
import ReportAPI from 'api/ReportAPI/ReportAPI';
import { getErrorToast } from 'helpers/toast';
import styles from './ReportModal.module.scss';

const ReportModal = () => {
  const [description, setDescription] = useState<string>('');

  const { isOpen } = useAppSelector((state) => state.modal.reportModal);
  const employee = useAppSelector((state) => state.employee.employee);

  const dispatch = useAppDispatch();
  const toast = useToast();

  const sendReport = () => {
    if (!employee) return;
    ReportAPI.create({ description, employeeId: employee.id })
      .then(() => {
        closeModal();
        setDescription('');
      })
      .catch((e) => toast(getErrorToast('ReportModal.sendReport', e)));
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('reportModal'));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Оставить отзыв
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Text className={styles.description}>
            Сообщите о проблеме, или о том, что можно улучшить
          </Text>
          <AutoResizableTextarea
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="yellow"
            isDisabled={!description.length}
            onClick={sendReport}
          >
            Отправить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReportModal;
