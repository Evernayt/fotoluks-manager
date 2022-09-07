import { Button, SelectButton } from 'components';
import { ButtonVariants } from 'components/UI/Button/Button';
import { logo } from 'constants/images';
import {
  INITIAL_SETTINGS_COMPLETED_KEY,
  MAIN_FOLDER_KEY,
  SHOP_KEY,
} from 'constants/localStorage';
import { LOGIN_ROUTE } from 'constants/paths';
import { Placements } from 'helpers/calcPlacement';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchShopsAPI } from 'http/shopAPI';
import { IShop } from 'models/IShop';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appSlice } from 'store/reducers/AppSlice';
import styles from './InitialSettingsPage.module.css';

const InitialSettingsPage = () => {
  const [shops, setShops] = useState<IShop[]>([]);

  const mainFolder = useAppSelector((state) => state.app.mainFolder);
  const activeShop = useAppSelector((state) => state.app.activeShop);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
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
    });
  };

  const selectShop = (e: IShop) => {
    dispatch(appSlice.actions.setActiveShop(e));
  };

  const save = () => {
    localStorage.setItem(MAIN_FOLDER_KEY, mainFolder);
    localStorage.setItem(SHOP_KEY, JSON.stringify(activeShop));
    localStorage.setItem(INITIAL_SETTINGS_COMPLETED_KEY, 'true');

    navigate(LOGIN_ROUTE);
  };

  return (
    <div className={styles.container}>
      <img className={styles.logo} src={logo} />
      <div className={styles.title}>Первый запуск</div>
      <div className={styles.description}>
        Укажите основную папку и текущий филиал.
      </div>
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.card_label}>
            Основная папка (ФОТОЛЮКС_Текущее)
          </div>
          <div className={styles.folder_select}>
            <Button onClick={selectFolder}>
              {mainFolder ? 'Изменить папку' : 'Выбрать папку'}
            </Button>
            {mainFolder && <div className={styles.folder}>{mainFolder}</div>}
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.card_label}>Текущий филиал</div>
          <div className={styles.folder_select}>
            <SelectButton
              items={shops}
              defaultSelectedItem={activeShop}
              changeHandler={selectShop}
              placement={Placements.bottomStart}
            />
          </div>
        </div>
        <Button
          className={styles.save_button}
          variant={ButtonVariants.primary}
          disabled={mainFolder === '' || activeShop.id === 0}
          onClick={save}
        >
          Применить
        </Button>
      </div>
    </div>
  );
};

export default InitialSettingsPage;
