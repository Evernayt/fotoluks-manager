import { IconMoysklad } from 'icons';
import {
  CONTROL_ROUTE,
  MOYSKLAD_ROUTE,
  ORDERS_ROUTE,
  TASKS_ROUTE,
} from './paths';
import {
  IconClipboardList,
  IconNote,
  IconLayoutGridAdd,
} from '@tabler/icons-react';

enum MODES {
  ADD_MODE = 'ADD_MODE',
  EDIT_MODE = 'EDIT_MODE',
}

const UI_DATE_FORMAT = 'DD.MM.YYYY HH:mm';
const NOT_INDICATED = 'Не указано';
const FETCH_MORE_LIMIT = 25;
const MAIN_FOLDER_NAME = 'ФОТОЛЮКС_Текущее';
const ICON_SIZE = 20;
const ICON_STROKE = 1.5;
const CONTEXT_MENU_ICON_STYLE = { marginRight: '0.75rem' };
const REQUIRED_INVALID_MSG = 'Не должно быть пустым';
const SHOP_INVALID_MSG = 'Нужно выбрать филиал';
const MIN_INVALID_MSG = 'Не заполнено до конца';

const APPS = [
  {
    id: 1,
    value: 'ORDERS',
    description: 'Заказы',
    route: ORDERS_ROUTE,
    Icon: IconClipboardList,
  },
  {
    id: 4,
    value: 'TASKS',
    description: 'Задачи',
    route: TASKS_ROUTE,
    Icon: IconNote,
  },
  {
    id: 3,
    value: 'MOYSKLAD',
    description: 'МойСклад',
    route: MOYSKLAD_ROUTE,
    Icon: IconMoysklad,
  },
  {
    id: 2,
    value: 'CONTROL_PANEL',
    description: 'Панель управления',
    route: CONTROL_ROUTE,
    Icon: IconLayoutGridAdd,
  },
];

export {
  MODES,
  UI_DATE_FORMAT,
  NOT_INDICATED,
  FETCH_MORE_LIMIT,
  MAIN_FOLDER_NAME,
  ICON_SIZE,
  ICON_STROKE,
  CONTEXT_MENU_ICON_STYLE,
  APPS,
  REQUIRED_INVALID_MSG,
  SHOP_INVALID_MSG,
  MIN_INVALID_MSG,
};
