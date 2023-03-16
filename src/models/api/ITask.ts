import { GetTasksDto } from './../../api/TaskAPI/dto/get-tasks.dto';
import { IFilter } from './../IFilter';
import { IData } from './../IData';
import { IEmployee } from './IEmployee';
import { IDepartment } from './IDepartment';
import { IShop } from './IShop';
import { ITaskMember } from './ITaskMember';
import { ITaskMessage } from './ITaskMessage';

export interface ITask {
  id: number;
  title: string;
  description: string;
  urgent: boolean;
  createdAt: string;
  completed: boolean;
  completedDate: string;
  archive: boolean;
  shop?: IShop;
  department?: IDepartment;
  creator?: IEmployee;
  executor?: IEmployee;
  taskMessages?: ITaskMessage[];
  taskMembers?: ITaskMember[];
}

export type ITaskData = IData<ITask[]>;

export interface ITasksFilter extends Partial<IFilter>, GetTasksDto {}
