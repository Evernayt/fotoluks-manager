import { IUser } from "./IUser";

export interface IOrderMember {
  id: number | string;
  user: IUser;
}