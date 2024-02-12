import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { modalActions } from 'store/reducers/ModalSlice';
import OrderFilesTable from './table/OrderFilesTable';
import { ChangeEvent, useMemo, useRef } from 'react';
import { IOrderFile } from 'models/api/IOrderFile';
import { v4 as uuidv4 } from 'uuid';
import { orderActions } from 'store/reducers/OrderSlice';
import { IconPaperclip } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { IFilePathForUpload } from 'models/IFileForUpload';
import { getBytesByMb, groupBy } from 'helpers';
import { getErrorToast } from 'helpers/toast';

const OrderFilesModal = () => {
  const { isOpen, orderProductId } = useAppSelector(
    (state) => state.modal.orderFilesModal
  );
  const orderFiles = useAppSelector((state) => state.order.order.orderFiles);

  const isAllFilesModal = orderProductId === null;

  const orderFilesGroup = useMemo(() => {
    if (!orderFiles || orderFiles.length <= 0 || orderProductId === undefined) {
      return [];
    }
    if (isAllFilesModal) {
      return groupBy(orderFiles, (x) => x.orderProductId);
    } else {
      return [orderFiles.filter((x) => x.orderProductId === orderProductId)];
    }
  }, [orderFiles, orderProductId]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const toast = useToast();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const filesSelectHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (!orderProductId) return;
    if (event.target.files && event.target.files.length > 0) {
      const files = event.target.files;
      const orderFiles: IOrderFile[] = [];
      const orderFilePathsForUpload: IFilePathForUpload[] = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i].size >= getBytesByMb(300)) {
          toast(
            getErrorToast(
              `Файл ${files[i].name} слишком большой`,
              'Максимальный размер файла 300 МБ'
            )
          );
        } else {
          const id = uuidv4();
          orderFiles.push({
            id,
            name: files[i].name,
            size: files[i].size,
            orderProductId,
            isWaitingUploading: true,
          });
          orderFilePathsForUpload.push({
            id,
            targetId: orderProductId,
            filePath: files[i].path,
          });
        }
      }
      dispatch(orderActions.addOrderFiles(orderFiles));
      dispatch(
        orderActions.addOrderFilePathsForUpload(orderFilePathsForUpload)
      );
    }
  };

  const closeModal = () => {
    dispatch(modalActions.closeModal('orderFilesModal'));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Список файлов</ModalHeader>
        <ModalCloseButton />
        <OrderFilesTable orderFilesGroup={orderFilesGroup} />
        <ModalFooter gap="var(--space-sm)">
          <Button onClick={closeModal}>Закрыть</Button>
          {!isAllFilesModal && (
            <Button
              leftIcon={<IconPaperclip size={ICON_SIZE} stroke={ICON_STROKE} />}
              colorScheme="yellow"
              onClick={handleClick}
            >
              Прикрепить файлы
            </Button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            multiple
            onChange={filesSelectHandler}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderFilesModal;
