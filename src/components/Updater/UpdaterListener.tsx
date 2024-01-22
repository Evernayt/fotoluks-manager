import { useAppDispatch } from 'hooks/redux';
import { useEffect } from 'react';
import packageInfo from '../../../release/app/package.json';
import { appActions } from 'store/reducers/AppSlice';

const UpdaterListener = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    newVerisonCheckListener();
    newVerisonCheckFailureListener();
    newVerisonDownloadListener();
    newVerisonDownloadFailureListener();
    newVerisonDownloadProgressListener();

    checkNewVersion();
  }, []);

  const checkNewVersion = () => {
    window.electron.ipcRenderer.sendMessage('check-update-pending', []);
  };

  const newVerisonCheckListener = () => {
    window.electron.ipcRenderer.on('check-update-success', (event: any) => {
      if (event && event.version !== packageInfo.version) {
        dispatch(appActions.setCheckUpdate({ success: true }));
        dispatch(appActions.setVersion(event.version));
        download();
      } else {
        dispatch(appActions.setCheckUpdate({}));
      }
    });
  };

  const newVerisonCheckFailureListener = () => {
    window.electron.ipcRenderer.on('check-update-failure', () => {
      dispatch(appActions.setCheckUpdate({ failure: true }));
    });
  };

  const newVerisonDownloadListener = () => {
    window.electron.ipcRenderer.on('download-update-success', () => {
      dispatch(appActions.setDownloadUpdate({ success: true }));
    });
  };

  const newVerisonDownloadFailureListener = () => {
    window.electron.ipcRenderer.on('download-update-failure', () => {
      dispatch(appActions.setDownloadUpdate({ failure: true }));
    });
  };

  const newVerisonDownloadProgressListener = () => {
    window.electron.ipcRenderer.on(
      'download-update-progress',
      //@ts-ignore
      (percent: number) => {
        dispatch(appActions.setDownloadingProgress(Math.round(percent)));
      }
    );
  };

  const download = () => {
    window.electron.ipcRenderer.sendMessage('download-update-pending', []);
    window.electron.ipcRenderer.sendMessage('download-update-progress', []);
    dispatch(appActions.setDownloadUpdate({ pending: true }));
  };

  return null;
};

export default UpdaterListener;
