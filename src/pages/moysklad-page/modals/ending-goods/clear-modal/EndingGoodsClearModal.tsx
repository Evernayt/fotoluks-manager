import { useAppDispatch } from 'hooks/redux';
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { FC } from 'react';
import {
  removeNotAvailableGoods,
  removeOrderedGoods,
} from 'helpers/localStorage';
import { endingGoodsActions } from 'store/reducers/EndingGoodsSlice';
import { moyskladActions } from 'store/reducers/MoyskladSlice';

interface EndingGoodsClearModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EndingGoodsClearModal: FC<EndingGoodsClearModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const clear = () => {
    removeOrderedGoods();
    removeNotAvailableGoods();
    dispatch(endingGoodsActions.setOrderedGoods([]));
    dispatch(endingGoodsActions.setNotAvailableGoods([]));
    dispatch(moyskladActions.setForceUpdate(true));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Очистить заказанное?</ModalHeader>
        <ModalCloseButton />
        <ModalFooter gap="var(--space-sm)">
          <Button onClick={onClose}>Нет</Button>
          <Button colorScheme="yellow" onClick={clear}>
            Да
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EndingGoodsClearModal;
