import { useAppDispatch, useAppSelector } from 'hooks/redux';
import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Progress,
  Text,
} from '@chakra-ui/react';
import {
  IconArrowBarToDown,
  IconCloudDownload,
  IconCloudX,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { appActions } from 'store/reducers/AppSlice';
import styles from './Updater.module.scss';

const Updater = () => {
  const checkUpdate = useAppSelector((state) => state.app.checkUpdate);
  const downloadUpdate = useAppSelector((state) => state.app.downloadUpdate);
  const version = useAppSelector((state) => state.app.version);
  const downloadingProgress = useAppSelector(
    (state) => state.app.downloadingProgress
  );

  const isHide = !checkUpdate.success;

  const dispatch = useAppDispatch();

  const repeatDownload = () => {
    window.electron.ipcRenderer.sendMessage('download-update-pending', []);
    window.electron.ipcRenderer.sendMessage('download-update-progress', []);
    dispatch(appActions.setDownloadUpdate({ pending: true }));
  };

  const quitAndInstall = () => {
    window.electron.ipcRenderer.sendMessage('quit-and-install-update', []);
  };

  const getDownloadNewVerisonMessage = () => {
    if (downloadUpdate.pending) {
      return 'Загрузка обновления...';
    } else if (downloadUpdate.success) {
      return 'Обновление загружено';
    } else if (downloadUpdate.failure) {
      return 'Ошибка загрузки обновления';
    } else {
      return '';
    }
  };

  const renderIcon = () => {
    if (downloadUpdate.pending) {
      return (
        <IconCloudDownload
          className={styles.animate}
          size={ICON_SIZE}
          stroke={ICON_STROKE}
        />
      );
    } else if (downloadUpdate.success) {
      return <IconArrowBarToDown size={ICON_SIZE} stroke={ICON_STROKE} />;
    } else if (downloadUpdate.failure) {
      return <IconCloudX size={ICON_SIZE} stroke={ICON_STROKE} />;
    }
  };

  const renderContent = () => {
    if (downloadUpdate.pending) {
      return (
        <Progress
          value={downloadingProgress}
          colorScheme="yellow"
          w="100%"
          borderRadius="full"
        />
      );
    } else if (downloadUpdate.success) {
      return (
        <Button colorScheme="yellow" w="100%" onClick={quitAndInstall}>
          Перезапустить
        </Button>
      );
    } else if (downloadUpdate.failure) {
      return (
        <Button w="100%" onClick={repeatDownload}>
          Повторить
        </Button>
      );
    }
  };

  return !isHide ? (
    <Menu autoSelect={false}>
      <MenuButton
        as={IconButton}
        icon={renderIcon()}
        aria-label="downloading"
        colorScheme={downloadUpdate.success ? 'yellow' : 'gray'}
        isRound
      />
      <MenuList p={0}>
        <div className={styles.container}>
          <div>
            <Text>{`Версия: ${version}`}</Text>
            <Text>{getDownloadNewVerisonMessage()}</Text>
          </div>
          {renderContent()}
        </div>
      </MenuList>
    </Menu>
  ) : null;
};

export default Updater;
