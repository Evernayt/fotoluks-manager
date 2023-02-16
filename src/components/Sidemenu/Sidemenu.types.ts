import { ElementType } from 'react';

export interface ISidemenuItem {
  id: number;
  name: string;
  Icon: ElementType;
}

export interface ISidemenuAddButton {
  text: string;
  onClick: () => void;
}
