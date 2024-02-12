import { useAppDispatch } from 'hooks/redux';
import { useEffect } from 'react';
import { appActions } from 'store/reducers/AppSlice';
import { useToast } from '@chakra-ui/react';
import { getErrorToast, getSuccessToast } from 'helpers/toast';
import { DownloadItem } from 'electron';
import type { File } from 'electron-dl';
import { getFileNameByURL } from 'helpers';

const DownloaderListener = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    downloadCompletedListener();
    downloadCancelListener();
    downloadErrorListener();

    return () => {
      window.electron.ipcRenderer.removeAllListeners('download-file-completed');
      window.electron.ipcRenderer.removeAllListeners('download-file-cancel');
      window.electron.ipcRenderer.removeAllListeners('download-file-error');
    };
  }, []);

  const downloadCompletedListener = () => {
    window.electron.ipcRenderer.on('download-file-completed', (file: File) => {
      const url = decodeURIComponent(file.url);
      dispatch(appActions.deleteDownlodingFile(url));
      toast(getSuccessToast(`Файл ${file.filename} загружен`));
    });
  };

  const downloadCancelListener = () => {
    window.electron.ipcRenderer.on(
      'download-file-cancel',
      (downloadItem: DownloadItem) => {
        const url = decodeURIComponent(downloadItem.getURL());
        dispatch(appActions.deleteDownlodingFile(url));
        toast(
          getErrorToast(`Не удалось скачать файл ${downloadItem.getFilename()}`)
        );
      }
    );
  };

  const downloadErrorListener = () => {
    window.electron.ipcRenderer.on('download-file-error', (url: string) => {
      dispatch(appActions.deleteDownlodingFile(url));
      toast(getErrorToast(`Не удалось скачать файл ${getFileNameByURL(url)}`));
    });
  };

  return null;
};

export default DownloaderListener;
