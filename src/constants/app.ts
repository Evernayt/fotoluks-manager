import { IconControlPanel, IconMoysklad, IconNote, IconOrders } from 'icons';
import { ITheme } from 'models/ITheme';
import {
  CONTROL_PANEL_ROUTE,
  MOYSKLAD_ROUTE,
  ORDERS_ROUTE,
  TASKS_ROUTE,
} from './paths';

enum Modes {
  ADD_MODE = 'ADD_MODE',
  EDIT_MODE = 'EDIT_MODE',
}

const INPUT_DATE_FORMAT = 'YYYY-MM-DDTHH:mm';
const DEF_DATE_FORMAT = 'DD.MM.YYYY HH:mm';
const NOT_INDICATED = 'Не указано';

const THEMES: ITheme[] = [
  {
    id: 1,
    name: 'Светлая',
    value: 'LIGHT',
  },
  {
    id: 2,
    name: 'Темная',
    value: 'DARK',
  },
];

const APPS = [
  {
    value: 'ORDERS',
    description: 'Заказы',
    route: ORDERS_ROUTE,
    Icon: IconOrders,
  },
  {
    value: 'TASKS',
    description: 'Задачи',
    route: TASKS_ROUTE,
    Icon: IconNote,
  },
  {
    value: 'MOYSKLAD',
    description: 'МойСклад',
    route: MOYSKLAD_ROUTE,
    Icon: IconMoysklad,
  },
  {
    value: 'CONTROL_PANEL',
    description: 'Панель управления',
    route: CONTROL_PANEL_ROUTE,
    Icon: IconControlPanel,
  },
];

export {
  Modes,
  INPUT_DATE_FORMAT,
  DEF_DATE_FORMAT,
  THEMES,
  APPS,
  NOT_INDICATED,
};
