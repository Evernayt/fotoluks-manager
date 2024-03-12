import { IData } from 'models/IData';
import { IEmployee } from './IEmployee';

export interface IChatMessage {
  id: number;
  message: string;
  type: 'text' | 'image';
  createdAt: string;
  updatedAt: string;
  edited: boolean;
  chatId: number;
  employee: IEmployee;
}

export type IChatMessageData = IData<IChatMessage[]>;
