import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { FC } from 'react';
import MoyskladCounterpartyTable from './MoyskladCounterpartyTable';
import { ICounterparty } from 'models/api/moysklad/ICounterparty';

interface MoyskladCounterpartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCounterpartyClick: (counterparty: ICounterparty) => void;
}

const MoyskladCounterpartyModal: FC<MoyskladCounterpartyModalProps> = ({
  isOpen,
  onClose,
  onCounterpartyClick,
}) => {
  const onCounterpartyClickHandler = (counterparty: ICounterparty) => {
    onCounterpartyClick(counterparty);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Импорт из МойСклад</ModalHeader>
        <ModalCloseButton />
        <MoyskladCounterpartyTable
          onCounterpartyClick={onCounterpartyClickHandler}
        />
      </ModalContent>
    </Modal>
  );
};

export default MoyskladCounterpartyModal;
