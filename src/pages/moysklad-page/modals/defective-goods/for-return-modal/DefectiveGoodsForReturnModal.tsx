import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
} from '@chakra-ui/react';
import { groupBy } from 'helpers';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IDefectiveGood } from 'models/IDefectiveGood';
import { useEffect, useMemo } from 'react';
import { defectiveGoodsActions } from 'store/reducers/DefectiveGoodsSlice';
import { modalActions } from 'store/reducers/ModalSlice';
import { IconReceiptRefund } from '@tabler/icons-react';
import DefectiveGoodsProduct from './product/DefectiveGoodsProduct';
import { setDefectiveGoods } from 'helpers/localStorage';
import styles from './DefectiveGoodsForReturnModal.module.scss';

const DefectiveGoodsForReturnModal = () => {
  const { isOpen } = useAppSelector((state) => state.modal.defectiveGoodsModal);
  const defectiveGoods = useAppSelector(
    (state) => state.defectiveGoods.defectiveGoods
  );
  const activeSidebarIndex = useAppSelector(
    (state) => state.moysklad.activeSidebarIndex
  );

  const dispatch = useAppDispatch();

  const groupedDefectiveGoods = useMemo<IDefectiveGood[][]>(
    () => groupBy(defectiveGoods, 'incomingNumber'),
    [defectiveGoods]
  );

  useEffect(() => {
    if (activeSidebarIndex === 4) {
      setDefectiveGoods(defectiveGoods);
    }
  }, [defectiveGoods]);

  const removeAll = () => {
    dispatch(defectiveGoodsActions.removeAll());
    closeModal();
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('defectiveGoodsModal'));
    dispatch(defectiveGoodsActions.setLastDefectiveGood(null));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Товары на возврат</ModalHeader>
        <ModalCloseButton />
        <ModalBody className={styles.container}>
          {groupedDefectiveGoods.length ? (
            <div className={styles.groups}>
              {groupedDefectiveGoods.map((defectiveGoods) => (
                <div key={defectiveGoods[0].incomingNumber}>
                  <Tag className={styles.group}>
                    <Text as="b">{defectiveGoods[0].agent.name}</Text>
                    <Text>{defectiveGoods[0].incomingNumber}</Text>
                  </Tag>

                  <div className={styles.products}>
                    {defectiveGoods.map((defectiveGood) => (
                      <DefectiveGoodsProduct
                        defectiveGood={defectiveGood}
                        key={defectiveGood.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.no_products}>
              <IconReceiptRefund className="link-icon" size={48} stroke={1.1} />
              <Text variant="secondary">Ничего не добавлено</Text>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={removeAll}>
            Удалить все
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DefectiveGoodsForReturnModal;
