import { IEmployee } from './IEmployee';
import { IChatMessage } from './IChatMessage';
import { IChatMember } from './IChatMember';
import { IData } from 'models/IData';
import { IChatReadMessage } from './IChatReadMessage';

export interface IChat {
  id: number;
  name: string;
  image: string;
  creatorId: number;
  creator: IEmployee;
  latestMessageId: number | null;
  chatMembers?: IChatMember[];
  chatMessages?: IChatMessage[];
  chatReadMessages?: IChatReadMessage[];
}

export type IChatData = IData<IChat[]>;
