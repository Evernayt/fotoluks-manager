import { ITheme } from 'models/ITheme';

enum Modes {
  ADD_MODE = 'ADD_MODE',
  EDIT_MODE = 'EDIT_MODE',
}

const INPUT_FORMAT = 'YYYY-MM-DDTHH:mm';
const DEF_FORMAT = 'DD.MM.YYYY HH:mm';

const Themes: ITheme[] = [
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

export { Modes, INPUT_FORMAT, DEF_FORMAT, Themes };
