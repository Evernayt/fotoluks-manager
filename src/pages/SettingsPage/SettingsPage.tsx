import { Button, Checkbox, Navmenu, SelectButton } from 'components';
import {
  MAIN_FOLDER_KEY,
  MAXIMIZE_SCREEN_KEY,
  SHOP_KEY,
} from 'constants/localStorage';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchShopsAPI } from 'http/shopAPI';
import { IShop } from 'models/IShop';
import { useEffect, useState } from 'react';
import { appSlice } from 'store/reducers/AppSlice';
import styles from './SettingsPage.module.css';

const SettingsPage = () => {
  const [shops, setShops] = useState<IShop[]>([]);
  const [maximizeScreen, setMaximizeScreen] = useState<boolean>(false);

  const mainFolder = useAppSelector((state) => state.app.mainFolder);
  const activeShop = useAppSelector((state) => state.app.activeShop);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const maximize: boolean =
      localStorage.getItem(MAXIMIZE_SCREEN_KEY) === 'true';
    setMaximizeScreen(maximize);

    const folder = localStorage.getItem(MAIN_FOLDER_KEY);
    dispatch(appSlice.actions.setMainFolder(folder ? folder : ''));

    fetchShops();
  }, []);

  const fetchShops = () => {
    fetchShopsAPI().then((data) => {
      setShops(data.rows);

      const shop = JSON.parse(localStorage.getItem(SHOP_KEY) || '{}');
      if (Object.keys(shop).length !== 0) {
        dispatch(appSlice.actions.setActiveShop(shop));
      }
    });
  };

  const selectFolder = () => {
    window.electron.ipcRenderer.sendMessage('select-directory', ['']);

    window.electron.ipcRenderer.once('select-directory', (arg: any) => {
      const fullPath: string = arg[0][0];
      if (fullPath === undefined) return;

      dispatch(appSlice.actions.setMainFolder(fullPath));
      localStorage.setItem(MAIN_FOLDER_KEY, fullPath);
    });
  };

  const selectShop = (e: IShop) => {
    dispatch(appSlice.actions.setActiveShop(e));
    localStorage.setItem(SHOP_KEY, JSON.stringify(e));
  };

  const maximizeScreenSizeToggle = () => {
    localStorage.setItem(MAXIMIZE_SCREEN_KEY, `${!maximizeScreen}`);
    setMaximizeScreen(!maximizeScreen);
  };

  return (
    <div className={styles.container}>
      <Navmenu />
      <div className={styles.panels}>
        <div className={styles.panel}>
          <div>
            <div className={styles.label}>На всеь экран при запуске</div>
            <Checkbox
              text={maximizeScreen ? 'Включено' : 'Выключено'}
              checked={maximizeScreen}
              onChange={maximizeScreenSizeToggle}
            />
          </div>
          <div>
            <div className={styles.label}>
              Основная папка (ФОТОЛЮКС_Текущее)
            </div>
            <div className={styles.folder_select}>
              <Button onClick={selectFolder}>
                {mainFolder ? 'Изменить папку' : 'Выбрать папку'}
              </Button>
              {mainFolder && <div className={styles.folder}>{mainFolder}</div>}
            </div>
          </div>
          <div>
            <div className={styles.label}>Текущий филиал</div>
            <div className={styles.folder_select}>
              <SelectButton
                items={shops}
                defaultSelectedItem={activeShop}
                changeHandler={selectShop}
                placement={Placements.bottomStart}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
