import { THEMES } from 'constants/app';
import { IEmployee } from 'models/api/IEmployee';
import { IShop } from 'models/api/IShop';
import { ITheme } from 'models/ITheme';

const MAIN_FOLDER_KEY = 'MAIN_FOLDER_KEY';
const SHOP_KEY = 'SHOP_KEY';
const RECENT_LOGINS_KEY = 'RECENT_LOGINS_KEY';
const INITIAL_SETTINGS_COMPLETED_KEY = 'INITIAL_SETTINGS_COMPLETED_KEY';
const MAXIMIZE_SCREEN_KEY = 'MAXIMIZE_SCREEN_KEY';
const TOKEN_KEY = 'TOKEN_KEY';
const THEME_KEY = 'THEME_KEY';

const setMainFolder = (folder: string) => {
  localStorage.setItem(MAIN_FOLDER_KEY, folder);
};

const getMainFolder = (): string => {
  const folder = localStorage.getItem(MAIN_FOLDER_KEY);
  return folder ? folder : '';
};

const setActiveShop = (shop: IShop) => {
  localStorage.setItem(SHOP_KEY, JSON.stringify(shop));
};

const getActiveShop = (): IShop | null => {
  const shop = JSON.parse(localStorage.getItem(SHOP_KEY) || '{}');
  if (Object.keys(shop).length) {
    return shop;
  } else {
    return null;
  }
};

const setRecentLogins = (recentLogins: IEmployee[]) => {
  localStorage.setItem(RECENT_LOGINS_KEY, JSON.stringify(recentLogins));
};

const getRecentLogins = (): IEmployee[] => {
  const recentLogins = JSON.parse(
    localStorage.getItem(RECENT_LOGINS_KEY) || '[]'
  );
  return recentLogins;
};

const setInitialSettingsCompleted = (completed: boolean) => {
  localStorage.setItem(INITIAL_SETTINGS_COMPLETED_KEY, completed.toString());
};

const getInitialSettingsCompleted = (): boolean => {
  return localStorage.getItem(INITIAL_SETTINGS_COMPLETED_KEY) === 'true';
};

const setMaximizeScreen = (maximize: boolean) => {
  localStorage.setItem(MAXIMIZE_SCREEN_KEY, maximize.toString());
};

const getMaximizeScreen = (): boolean => {
  return localStorage.getItem(MAXIMIZE_SCREEN_KEY) === 'true';
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const getToken = (): string => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? token : '';
};

const setTheme = (theme: ITheme) => {
  localStorage.setItem(THEME_KEY, JSON.stringify(theme));
};

const getTheme = (): ITheme => {
  const theme = JSON.parse(localStorage.getItem(THEME_KEY) || '{}');
  if (Object.keys(theme).length) {
    return theme;
  } else {
    return THEMES[0];
  }
};

export {
  setMainFolder,
  getMainFolder,
  setActiveShop,
  getActiveShop,
  setRecentLogins,
  getRecentLogins,
  setInitialSettingsCompleted,
  getInitialSettingsCompleted,
  setMaximizeScreen,
  getMaximizeScreen,
  setToken,
  getToken,
  setTheme,
  getTheme,
};
