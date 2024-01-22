import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { FC } from 'react';
import MoyskladAssortmentsTable from './MoyskladAssortmentsTable';
import { IAssortment } from 'models/api/moysklad/IAssortment';

interface MoyskladAssortmentsModalProps {
  isOpen: boolean;
  isBulkImport: boolean;
  onClose: () => void;
  onAssortmentClick: (assortment: IAssortment) => void;
}

const MoyskladAssortmentsModal: FC<MoyskladAssortmentsModalProps> = ({
  isOpen,
  isBulkImport,
  onClose,
  onAssortmentClick,
}) => {
  const onAssortmentClickHandler = (assortment: IAssortment) => {
    onAssortmentClick(assortment);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Импорт из МойСклад</ModalHeader>
        <ModalCloseButton />
        <MoyskladAssortmentsTable
          enableRowSelection={isBulkImport}
          onAssortmentClick={onAssortmentClickHandler}
          onModalClose={onClose}
        />
      </ModalContent>
    </Modal>
  );
};

export default MoyskladAssortmentsModal;
