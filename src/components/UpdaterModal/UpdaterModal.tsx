import Modal from 'components/Modal/Modal';
import Button, { ButtonVariants } from 'components/UI/Button/Button';
import Progress from 'components/UI/Progress/Progress';
import { logoBird } from 'constants/images';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useEffect, useState } from 'react';
import { appSlice } from 'store/reducers/AppSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import packageInfo from '../../../release/app/package.json';
import styles from './UpdaterModal.module.scss';

const UpdaterModal = () => {
  const [version, setVersion] = useState<string>('');
  const [percent, setPercent] = useState<number>(0);

  const updaterModal = useAppSelector((state) => state.modal.updaterModal);
  const checkUpdate = useAppSelector((state) => state.app.checkUpdate);
  const downloadUpdate = useAppSelector((state) => state.app.downloadUpdate);

  const dispatch = useAppDispatch();

  useEffect(() => {
    updateCheck();
    updateCheckFailure();
    updateDownload();
    updateDownloadFailure();
    updateDownloadProgress();
  }, []);

  const updateCheck = () => {
    window.electron.ipcRenderer.sendMessage('check-update-pending', []);
    window.electron.ipcRenderer.on('check-update-success', (event: any) => {
      if (event && event.version !== packageInfo.version) {
        dispatch(appSlice.actions.setCheckUpdate({ success: true }));
        setVersion(event.version);
      } else {
        dispatch(appSlice.actions.setCheckUpdate({}));
      }
    });
  };

  const updateCheckFailure = () => {
    window.electron.ipcRenderer.on('check-update-failure', () => {
      dispatch(appSlice.actions.setCheckUpdate({ failure: true }));
    });
  };

  const updateDownload = () => {
    window.electron.ipcRenderer.on('download-update-success', () => {
      dispatch(appSlice.actions.setDownloadUpdate({ success: true }));
    });
  };

  const updateDownloadFailure = () => {
    window.electron.ipcRenderer.on('download-update-failure', () => {
      dispatch(appSlice.actions.setDownloadUpdate({ failure: true }));
    });
  };

  const updateDownloadProgress = () => {
    window.electron.ipcRenderer.on(
      'download-update-progress',
      //@ts-ignore
      (percent: number) => {
        setPercent(Math.round(percent));
      }
    );
  };

  const getCheckUpdateMessage = () => {
    if (checkUpdate.success) {
      return `Доступна новая версия: ${version}`;
    } else if (checkUpdate.failure) {
      return 'Ошибка проверки обновлений';
    } else {
      return '';
    }
  };

  const getDownloadUpdateMessage = () => {
    if (downloadUpdate.pending) {
      return 'Скачивание обновлений...';
    } else if (downloadUpdate.success) {
      return 'Обновление скачано';
    } else if (downloadUpdate.failure) {
      return 'Ошибка скачивания обновлений';
    } else {
      return '';
    }
  };

  const renderButton = () => {
    if (
      checkUpdate.success &&
      !downloadUpdate.pending &&
      !downloadUpdate.success &&
      !downloadUpdate.failure
    ) {
      return (
        <Button variant={ButtonVariants.primary} onClick={download}>
          Загрузить
        </Button>
      );
    } else if (downloadUpdate.success) {
      return (
        <Button variant={ButtonVariants.primary} onClick={quitAndInstallUpdate}>
          Выйти и установить
        </Button>
      );
    } else {
      return <Button onClick={close}>ОК</Button>;
    }
  };

  const download = () => {
    window.electron.ipcRenderer.sendMessage('download-update-pending', []);
    window.electron.ipcRenderer.sendMessage('download-update-progress', []);
    dispatch(appSlice.actions.setDownloadUpdate({ pending: true }));
  };

  const quitAndInstallUpdate = () => {
    window.electron.ipcRenderer.sendMessage('quit-and-install-update', []);
  };

  const close = () => {
    if (checkUpdate.failure || downloadUpdate.failure) {
      dispatch(appSlice.actions.setCheckUpdate({}));
      dispatch(appSlice.actions.setDownloadUpdate({}));
    }
    dispatch(modalSlice.actions.closeModal('updaterModal'));
  };

  return (
    <Modal title="Обновление" isShowing={updaterModal.isShowing} hide={close}>
      <div className={styles.container}>
        <img src={logoBird} />
        <div className={styles.messages}>
          <span>{getCheckUpdateMessage()}</span>
          <span>{getDownloadUpdateMessage()}</span>
        </div>
        {downloadUpdate.pending && <Progress percent={percent} />}
        {renderButton()}
      </div>
    </Modal>
  );
};

export default UpdaterModal;
