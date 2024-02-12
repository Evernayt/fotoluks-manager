import { Box, IconButton, Tooltip } from '@chakra-ui/react';
import { IconClockUp, IconDownload } from '@tabler/icons-react';
import { Row } from '@tanstack/react-table';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IDownloadingFile } from 'models/IDownloadingFile';
import { IOrderFile } from 'models/api/IOrderFile';
import { FC } from 'react';
import { appActions } from 'store/reducers/AppSlice';

interface OrderFilesDownloadCellProps {
  row: Row<IOrderFile>;
}

const OrderFilesDownloadCell: FC<OrderFilesDownloadCellProps> = ({ row }) => {
  const downloadingFiles = useAppSelector(
    (state) => state.app.downloadingFiles
  );

  const isDownloading = downloadingFiles.some((x) => x.id === row.original.id);

  const dispatch = useAppDispatch();

  const download = () => {
    const downloadingFile: IDownloadingFile = {
      ...row.original,
      id: row.original.id as number,
      link: row.original.link as string,
    };
    dispatch(appActions.addDownlodingFile(downloadingFile));
    window.electron.ipcRenderer.sendMessage(
      'download-file',
      downloadingFile.link
    );
  };

  if (row.original.isWaitingUploading) {
    return (
      <div>
        <Tooltip label="Ожидает загрузки" placement="left">
          <IconButton
            icon={
              <IconClockUp
                className="link-icon"
                size={ICON_SIZE}
                stroke={ICON_STROKE}
              />
            }
            aria-label="waiting"
            variant="ghost"
            isDisabled
            _disabled={{ cursor: 'default' }}
          />
        </Tooltip>
      </div>
    );
  } else {
    return (
      <div>
        <IconButton
          icon={<IconDownload size={ICON_SIZE} stroke={ICON_STROKE} />}
          aria-label="download"
          variant="outline"
          isLoading={isDownloading}
          onClick={download}
        />
      </div>
    );
  }
};

export default OrderFilesDownloadCell;
