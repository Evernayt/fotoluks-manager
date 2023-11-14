import ShopAPI from 'api/ShopAPI/ShopAPI';
import { Button, Checkbox, Navmenu, SelectButton } from 'components';
import { MAIN_FOLDER_NAME, THEMES } from 'constants/app';
import {
  getActiveShop,
  getMainFolder,
  getMaximizeScreen,
  setActiveShop,
  setMainFolder,
  setMaximizeScreen,
} from 'helpers/localStorage';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IShop } from 'models/api/IShop';
import { ITheme } from 'models/ITheme';
import { useEffect, useState } from 'react';
import { appSlice } from 'store/reducers/AppSlice';
import styles from './SettingsPage.module.scss';
import { showGlobalMessage } from 'components/GlobalMessage/GlobalMessage.service';

const SettingsPage = () => {
  const theme = useAppSelector((state) => state.app.theme);

  const [folder, setFolder] = useState<string>(getMainFolder());
  const [selectedTheme, setSelectedTheme] = useState<ITheme>(theme);
  const [shops, setShops] = useState<IShop[]>([]);
  const [maximize, setMaximize] = useState<boolean>(getMaximizeScreen());

  const activeShop = useAppSelector((state) => state.app.activeShop);

  const dispatch = useAppDispatch();

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
        setMainFolder(fullPath);
      } else {
        showGlobalMessage(
          `Основная папка должна называться «${MAIN_FOLDER_NAME}»`
        );
      }
    });
  };

  const shopChangeHandler = (shop: IShop) => {
    dispatch(appSlice.actions.setActiveShop(shop));
    setActiveShop(shop);
  };

  const maximizeScreenSizeToggle = () => {
    setMaximizeScreen(!maximize);
    setMaximize(!maximize);
  };

  const themeChangeHandler = (theme: ITheme) => {
    if (theme.id === selectedTheme.id) return;

    setSelectedTheme(theme);
    dispatch(appSlice.actions.setTheme(theme));
  };

  return (
    <div className={styles.container}>
      <Navmenu />
      <div className={styles.panels}>
        <div className={styles.panel}>
          <div>
            <div className={styles.label}>Тема</div>
            <SelectButton
              items={THEMES}
              defaultSelectedItem={selectedTheme}
              onChange={themeChangeHandler}
            />
          </div>
          <div>
            <div className={styles.label}>На весь экран при запуске</div>
            <Checkbox
              text={maximize ? 'Включено' : 'Выключено'}
              checked={maximize}
              onChange={maximizeScreenSizeToggle}
            />
          </div>
          <div>
            <div className={styles.label}>
              {`Основная папка (${MAIN_FOLDER_NAME})`}
            </div>
            <div className={styles.folder_select}>
              <Button onClick={selectFolder}>
                {folder ? 'Изменить папку' : 'Выбрать папку'}
              </Button>
              {folder && <div className={styles.folder}>{folder}</div>}
            </div>
          </div>
          <div>
            <div className={styles.label}>Текущий филиал</div>
            <div className={styles.folder_select}>
              <SelectButton
                items={shops}
                defaultSelectedItem={activeShop}
                onChange={shopChangeHandler}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
