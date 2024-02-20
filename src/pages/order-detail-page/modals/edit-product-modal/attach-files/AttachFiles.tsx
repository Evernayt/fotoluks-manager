import { Button, useToast } from '@chakra-ui/react';
import { IconPaperclip } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { getBytesByMb } from 'helpers';
import { getErrorToast } from 'helpers/toast';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IFilePathForUpload } from 'models/IFileForUpload';
import { IOrderFile } from 'models/api/IOrderFile';
import { ChangeEvent, FC, useMemo, useRef } from 'react';
import { modalActions } from 'store/reducers/ModalSlice';
import { orderActions } from 'store/reducers/OrderSlice';
import { v4 as uuidv4 } from 'uuid';

interface AttachFilesProps {
  orderProductId: number | string;
}

const AttachFiles: FC<AttachFilesProps> = ({ orderProductId }) => {
  const orderFiles = useAppSelector((state) => state.order.order.orderFiles);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const orderProductFiles = useMemo(() => {
    if (!orderFiles || !orderProductId) return [];
    return orderFiles.filter((x) => x.orderProductId === orderProductId);
  }, [orderFiles, orderProductId]);

  const dispatch = useAppDispatch();
  const toast = useToast();

  const handleClick = () => {
    if (orderProductFiles.length > 0) {
      openFilesModal();
    } else {
      fileInputRef.current?.click();
    }
  };

  const filesSelectHandler = (event: ChangeEvent<HTMLInputElement>) => {
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

      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openFilesModal = () => {
    dispatch(
      modalActions.openModal({
        modal: 'orderFilesModal',
        props: { orderProductId },
      })
    );
  };

  return (
    <>
      <Button
        leftIcon={<IconPaperclip size={ICON_SIZE} stroke={ICON_STROKE} />}
        onClick={handleClick}
      >
        {orderProductFiles.length > 0
          ? `Список файлов: ${orderProductFiles.length}`
          : 'Прикрепить файлы'}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        multiple
        onChange={filesSelectHandler}
      />
    </>
  );
};

export default AttachFiles;
