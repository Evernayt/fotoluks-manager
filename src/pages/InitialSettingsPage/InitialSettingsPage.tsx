import ShopAPI from 'api/ShopAPI/ShopAPI';
import { Button, SelectButton } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { logoLight } from 'constants/images';
import { LOGIN_ROUTE } from 'constants/paths';
import {
  getActiveShop,
  getMainFolder,
  setActiveShop,
  setInitialSettingsCompleted,
  setMainFolder,
} from 'helpers/localStorage';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IShop } from 'models/api/IShop';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appSlice } from 'store/reducers/AppSlice';
import styles from './InitialSettingsPage.module.scss';
import { MAIN_FOLDER_NAME } from 'constants/app';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';

const InitialSettingsPage = () => {
  const [folder, setFolder] = useState<string>(getMainFolder());
  const [shops, setShops] = useState<IShop[]>([]);

  const activeShop = useAppSelector((state) => state.app.activeShop);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = () => {
    ShopAPI.getAll().then((data) => {
      setShops(data.rows);

      const shop = getActiveShop();
      if (shop) {
        dispatch(appSlice.actions.setActiveShop(shop));
      }
    });
  };

  const selectFolder = () => {
    window.electron.ipcRenderer.sendMessage('select-directory', ['']);
    window.electron.ipcRenderer.once('select-directory', (arg: any) => {
      const fullPath: string = arg[0][0];
      if (!fullPath) return;
      const pathArr = fullPath.split('\\');
      const lastFolder = pathArr[pathArr.length - 1];

      if (lastFolder === MAIN_FOLDER_NAME) {
        setFolder(fullPath);
      } else {
        showGlobalMessage(
          `Основная папка должна называться «${MAIN_FOLDER_NAME}»`
        );
      }
    });
  };

  const selectShop = (e: IShop) => {
    dispatch(appSlice.actions.setActiveShop(e));
  };

  const save = () => {
    setMainFolder(folder);
    setActiveShop(activeShop);
    setInitialSettingsCompleted(true);

    navigate(LOGIN_ROUTE);
  };

  return (
    <div className={styles.container}>
      <img className={styles.logo} src={logoLight} />
      <div className={styles.title}>Первый запуск</div>
      <div className={styles.description}>
        Укажите основную папку и текущий филиал.
      </div>
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.card_label}>
            {`Основная папка (${MAIN_FOLDER_NAME})`}
          </div>
          <div className={styles.folder_select}>
            <Button onClick={selectFolder}>
              {folder ? 'Изменить папку' : 'Выбрать папку'}
            </Button>
            {folder && <div className={styles.folder}>{folder}</div>}
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.card_label}>Текущий филиал</div>
          <div className={styles.folder_select}>
            <SelectButton
              items={shops}
              defaultSelectedItem={activeShop}
              onChange={selectShop}
            />
          </div>
        </div>
        <Button
          className={styles.save_button}
          variant={ButtonVariants.primary}
          disabled={folder === '' || activeShop.id === 0}
          onClick={save}
        >
          Применить
        </Button>
      </div>
    </div>
  );
};

export default InitialSettingsPage;
