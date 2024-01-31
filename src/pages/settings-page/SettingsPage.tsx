import { ICON_SIZE, ICON_STROKE, MAIN_FOLDER_NAME } from 'constants/app';
import {
  getMainFolder,
  getMaximizeScreen,
  setActiveShop,
  setMainFolder,
  setMaximizeScreen,
} from 'helpers/localStorage';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IShop } from 'models/api/IShop';
import { useState } from 'react';
import {
  Button,
  Card,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Switch,
  Tag,
  useToast,
} from '@chakra-ui/react';
import { IconFolder } from '@tabler/icons-react';
import { Select } from 'components';
import { appActions } from 'store/reducers/AppSlice';
import packageInfo from '../../../release/app/package.json';
import styles from './SettingsPage.module.scss';
import { useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE } from 'constants/paths';
import { employeeActions } from 'store/reducers/EmployeeSlice';
import { controlActions } from 'store/reducers/ControlSlice';
import { endingGoodsActions } from 'store/reducers/EndingGoodsSlice';
import { moyskladActions } from 'store/reducers/MoyskladSlice';
import { orderActions } from 'store/reducers/OrderSlice';
import { taskActions } from 'store/reducers/TaskSlice';
import { moveActions } from 'store/reducers/MoveSlice';
import socketio from 'socket/socketio';
import { getErrorToast, getSuccessToast } from 'helpers/toast';

const SettingsPage = () => {
  const [folder, setFolder] = useState<string>(getMainFolder());
  const [maximize, setMaximize] = useState<boolean>(getMaximizeScreen());

  const shops = useAppSelector((state) => state.app.shops);
  const activeShop = useAppSelector((state) => state.app.activeShop);
  const downloadUpdate = useAppSelector((state) => state.app.downloadUpdate);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const selectFolder = () => {
    window.electron.ipcRenderer.sendMessage('select-directory', ['']);
    window.electron.ipcRenderer.once('select-directory', (arg: any) => {
      const fullPath: string = arg[0][0];
      if (!fullPath) return;
      const pathArr = fullPath.split('\\');
      const lastFolder = pathArr[pathArr.length - 1];

      if (lastFolder === MAIN_FOLDER_NAME) {
        setFolder(fullPath);
        setMainFolder(fullPath);
      } else {
        toast(
          getErrorToast(
            `Основная папка должна называться «${MAIN_FOLDER_NAME}»`,
            ''
          )
        );
      }
    });
  };

  const shopChangeHandler = (shop: IShop) => {
    dispatch(appActions.setActiveShop(shop));
    setActiveShop(shop);
  };

  const toggleMaximizeScreenSize = () => {
    setMaximizeScreen(!maximize);
    setMaximize(!maximize);
  };

  const checkNewVersionOrInstall = () => {
    if (downloadUpdate.success) {
      window.electron.ipcRenderer.sendMessage('quit-and-install-update', []);
    } else {
      window.electron.ipcRenderer.sendMessage('check-update-pending', []);
    }
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    dispatch(appActions.clearState());
    dispatch(employeeActions.clearState());
    dispatch(controlActions.clearState());
    dispatch(endingGoodsActions.clearState());
    dispatch(moyskladActions.clearState());
    dispatch(orderActions.clearState());
    dispatch(taskActions.clearState());
    dispatch(moveActions.clearState());
    socketio.disconnect();
    toast(getSuccessToast('Данные удалены'));
    navigate(LOGIN_ROUTE);
  };

  return (
    <div className={styles.container}>
      <div className={styles.vertical_cards}>
        <Card className={styles.card}>
          <Heading size="md">Интерфейс</Heading>
          <FormControl flexDirection="row" display="flex" alignItems="center">
            <FormLabel mb={0}>На весь экран при запуске</FormLabel>
            <Switch isChecked={maximize} onChange={toggleMaximizeScreenSize} />
          </FormControl>
        </Card>
        <Card className={styles.card}>
          <Heading size="md">Обновление</Heading>
          <FormControl>
            <FormLabel>{`Текущая версия: ${packageInfo.version}`}</FormLabel>
            <Button
              colorScheme="yellow"
              w="100%"
              isLoading={downloadUpdate.pending}
              loadingText="Загрузка обновления"
              onClick={checkNewVersionOrInstall}
            >
              {downloadUpdate.success
                ? 'Перезапустить'
                : 'Проверить обновления'}
            </Button>
          </FormControl>
        </Card>
        <Card className={styles.card}>
          <Heading size="md">Локальные данные</Heading>
          <Button colorScheme="red" onClick={clearLocalStorage}>
            Очистить и перезапустить
          </Button>
        </Card>
      </div>
      <Card className={styles.card}>
        <Heading size="md">Система</Heading>
        <div>
          <FormLabel>{`Сетевое расположение (${MAIN_FOLDER_NAME})`}</FormLabel>
          <div className={styles.folder_container}>
            <Tag w="100%">{folder}</Tag>
            <IconButton
              icon={<IconFolder size={ICON_SIZE} stroke={ICON_STROKE} />}
              aria-label="folder"
              onClick={selectFolder}
            />
          </div>
        </div>
        <FormControl>
          <FormLabel>Текущий филиал</FormLabel>
          <Select
            placeholder="Филиал"
            value={activeShop.id === 0 ? null : activeShop}
            options={shops}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            onChange={shopChangeHandler}
          />
        </FormControl>
      </Card>
    </div>
  );
};

export default SettingsPage;
