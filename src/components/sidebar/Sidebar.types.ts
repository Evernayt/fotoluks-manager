import { ElementType } from 'react';

export interface ISidebarItem {
  id: number;
  name: string;
  Icon?: ElementType;
}

export interface ISidebarAddButton {
  name: string;
  onClick: () => void;
}
